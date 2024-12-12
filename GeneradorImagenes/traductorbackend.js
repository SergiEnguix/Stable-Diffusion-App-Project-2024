const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const { TranslationServiceClient } = require('@google-cloud/translate');
const cors = require('cors');  // Importa CORS

// Inicializar la aplicación Express
const app = express();
const port = 2053; // Puedes cambiar el puerto si lo necesitas

// Configura el SSL para HTTPS
const sslOptions = {
  key: fs.readFileSync('C:/Users/Usuario/Certificados/Nuevo/sergiencorsanywhere-key.pem'),  // Ruta a tu clave privada
  cert: fs.readFileSync('C:/Users/Usuario/Certificados/Nuevo/sergiencorsanywhere-cert.crt')  // Ruta a tu certificado público
};

// Inicializar el cliente de Google Cloud Translation con la cuenta de servicio
const client = new TranslationServiceClient({
  keyFilename: 'C:/Users/Usuario/Desktop/ProyectoASIR2024/lively-marking-444405-j8-23b069398886.json',  // Ruta a tu archivo JSON de la cuenta de servicio
});

// Habilitar CORS para todas las rutas
app.use(cors());  // Permite solicitudes desde cualquier origen

// Usa body-parser para analizar las solicitudes JSON
app.use(bodyParser.json());

// Ruta para traducir texto
app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;  // Esperamos que el cuerpo contenga 'text' y 'targetLanguage'

    // Configuración de la solicitud de traducción
    const request = {
      parent: client.locationPath('lively-marking-444405-j8', 'global'),  // Cambia 'lively-marking-444405' por tu ID de proyecto
      contents: [text],
      targetLanguageCode: targetLanguage,
      mimeType: 'text/plain',  // Tipo de contenido, puede ser 'text/html' si estás trabajando con HTML
    };

    // Realizar la solicitud de traducción
    const [response] = await client.translateText(request);

    // Devolver la traducción al cliente
    res.json({ translatedText: response.translations[0].translatedText });
  } catch (error) {
    console.error('Error de traducción:', error);
    res.status(500).json({ error: 'Error al traducir el texto' });
  }
});

// Iniciar el servidor HTTPS
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Servidor HTTPS escuchando en https://googleapi.sergiencorsanywhere.win:${port}`);
});
