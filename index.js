import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { uploadToDrive } from './drive.js'

config() // carga .env

const app = express()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(bodyParser.json({ limit: '10mb' }))

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    next()
})

// Ruta para subir imágenes
app.post('/api/upload', async (req, res) => {
    try {
        console.log('📸 Recibiendo imagen...')
        console.log('📍 Ruta:', req.path)
        console.log('🔧 Método:', req.method)

        if (!req.body.image) {
            console.log('❌ No se recibió imagen en el body')
            return res.status(400).json({ success: false, error: 'No se recibió imagen' })
        }

        const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, '')
        const fileName = `foto_${Date.now()}.jpg`
        const filePath = path.join(__dirname, fileName)

        console.log('📄 Nombre del archivo:', fileName)
        console.log('📁 Ruta del archivo:', filePath)
        console.log('📊 Tamaño base64:', base64Data.length)

        fs.writeFileSync(filePath, base64Data, 'base64')
        console.log('💾 Archivo temporal creado exitosamente')

        // ✅ PARÁMETRO CORREGIDO - usar DRIVE_FOLDER_ID, no GOOGLE_SERVICE_ACCOUNT
        const fileId = await uploadToDrive(filePath, fileName, process.env.DRIVE_FOLDER_ID)

        fs.unlinkSync(filePath) // borrar archivo temporal
        console.log('🗑️ Archivo temporal eliminado')

        console.log('✅ Subida exitosa, ID:', fileId)
        res.json({ success: true, fileId })
    } catch (err) {
        console.error('❌ Error al subir:', err)
        console.error('📋 Stack trace:', err.stack)
        res.status(500).json({ success: false, error: err.message })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`   - DRIVE_FOLDER_ID: ${process.env.DRIVE_FOLDER_ID ? 'Configurado' : 'NO configurado'}`)
    console.log(`   - GOOGLE_SERVICE_ACCOUNT: ${process.env.GOOGLE_SERVICE_ACCOUNT ? 'Configurado' : 'NO configurado'}`)
})
