import { google } from "googleapis";
import fs from "fs";

// Configurar auth usando variables de entorno en lugar de archivo
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT), // Variable de entorno
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const driveService = google.drive({ version: "v3", auth });

export async function uploadToDrive(filePath, fileName, folderId) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: "image/jpeg",
      body: fs.createReadStream(filePath),
    };

    const response = await driveService.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    console.error("Error en uploadToDrive:", error);
    throw error;
  }
}