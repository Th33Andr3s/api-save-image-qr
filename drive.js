import { google } from 'googleapis'
import fs from 'fs'

export async function uploadToDrive(filePath, fileName, folderId) {
    try {
        console.log('🔑 Configurando Google Drive API...')
        
        // Parsear las credenciales del service account
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)
        
        // Configurar autenticación
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        })
        
        const drive = google.drive({ version: 'v3', auth })
        
        console.log('📤 Subiendo archivo a Google Drive...')
        console.log('📁 Folder ID:', folderId)
        console.log('📄 Archivo:', fileName)
        
        const fileMetadata = {
            name: fileName,
            parents: folderId ? [folderId] : undefined
        }
        
        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(filePath)
        }
        
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        })
        
        console.log('✅ Archivo subido exitosamente, ID:', response.data.id)
        return response.data.id
        
    } catch (error) {
        console.error('❌ Error en uploadToDrive:', error)
        throw new Error(`Error al subir a Google Drive: ${error.message}`)
    }
}