import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { uploadToDrive } from "./drive.js";

config(); // carga .env

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json({ limit: "10mb" }));

// CORS mejorado
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

app.post("/", async (req, res) => {
  try {
    console.log('📸 Recibiendo imagen...');
    // Log de la URL de la API
    console.log('📍 Ruta:', req.path);
    
    if (!req.body.image) {
      return res.status(400).json({ success: false, error: 'No se recibió imagen' });
    }

    const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `foto_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, base64Data, "base64");
    console.log('💾 Archivo temporal creado');
    console.log('FOTO:', base64Data.length);

    const fileId = await uploadToDrive(filePath, fileName, process.env.GOOGLE_SERVICE_ACCOUNT);
    fs.unlinkSync(filePath); // borrar archivo temporal
    
    console.log('✅ Subida exitosa:', fileId);
    res.json({ success: true, fileId });
  } catch (err) {
    console.error("❌ Error al subir:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {  // Importante: '0.0.0.0'
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});