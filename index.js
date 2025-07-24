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
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Habilita CORS
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/api/upload", async (req, res) => {
  try {
    const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    const fileName = `foto_${Date.now()}.jpg`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, base64Data, "base64");

    const fileId = await uploadToDrive(filePath, fileName, process.env.DRIVE_FOLDER_ID);
    fs.unlinkSync(filePath); // borrar archivo temporal

    res.json({ success: true, fileId });
  } catch (err) {
    console.error("Error al subir:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});