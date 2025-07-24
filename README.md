# api-save-image-qr

API para guardar imágenes en Google Drive.

## Requisitos

- Node.js
- NPM
- Google Drive API

## Configuración

1. Crear un proyecto en Google Cloud Platform (GCP) y habilitar la API de Drive.
2. Crear una cuenta de servicio de Google (GSuite) y habilitar la API de Drive.
3. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
DRIVE_FOLDER_ID=ID de la carpeta en la que se van a guardar las imágenes
GOOGLE_SERVICE_ACCOUNT=Json de la cuenta de servicio de Google
```

4. Congifurar puerto y URL de la API de manera publica en railway.com.

4. Ejecutar `npm install` para instalar las dependencias.

## Ejecución

1. Ejecutar `npm start` para iniciar el servidor.
2. Abrir la ruta `http://localhost:3000/api/upload` en tu navegador web.
3. Subir una imagen en formato base64 en el cuerpo del request.
4. Recibirás una respuesta con el ID de la imagen en la propiedad `fileId`.

## Ejemplo de uso

```bash
curl --location --request POST 'http://localhost:3000/api/upload' \
--header 'Content-Type: application/json' \
--data-raw '{
    "file": "Base64 de la imagen"
}'
```

## Licencia

MIT License

Copyright (c) 2025 [Andres Felipe Olaya]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND...