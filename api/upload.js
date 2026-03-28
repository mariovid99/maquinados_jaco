const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const jwt = require('jsonwebtoken');
const Busboy = require('busboy');
const crypto = require('crypto');
const path = require('path');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw new Error('Token ausente');
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'maquinados-jaco-cms',
  });
}

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verify JWT
  try {
    verifyToken(req);
  } catch (err) {
    return res.status(401).json({ error: 'No autorizado: ' + err.message });
  }

  return new Promise((resolve) => {
    let busboy;
    try {
      busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 0 },
      });
    } catch (err) {
      res.status(400).json({ error: 'Content-Type inválido para subida de archivo' });
      return resolve();
    }

    let fileBuffer = null;
    let detectedMime = null;
    let detectedExt = '.jpg';
    let uploadError = null;

    busboy.on('file', (fieldname, fileStream, info) => {
      const { mimeType, filename } = info;

      if (!ALLOWED_MIME.has(mimeType)) {
        fileStream.resume(); // drain without processing
        uploadError = 'Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.';
        return;
      }

      detectedMime = mimeType;
      // Prefer extension from filename, fall back to MIME type
      const extFromFile = path.extname(filename || '').toLowerCase();
      detectedExt = extFromFile || MIME_TO_EXT[mimeType] || '.jpg';

      const chunks = [];
      let exceeded = false;

      fileStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      fileStream.on('limit', () => {
        exceeded = true;
        uploadError = 'El archivo supera el límite de 4 MB.';
      });

      fileStream.on('end', () => {
        if (!exceeded) {
          fileBuffer = Buffer.concat(chunks);
        }
      });
    });

    busboy.on('finish', async () => {
      if (uploadError) {
        res.status(400).json({ error: uploadError });
        return resolve();
      }

      if (!fileBuffer || !detectedMime) {
        res.status(400).json({ error: 'No se recibió ningún archivo.' });
        return resolve();
      }

      // Generate a unique, safe S3 key
      const randomHex = crypto.randomBytes(6).toString('hex');
      const key = `images/${Date.now()}-${randomHex}${detectedExt}`;

      try {
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: detectedMime,
          // Public read is set via bucket policy for images/*
        });

        await s3.send(command);

        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        res.status(200).json({ url, key });
        resolve();
      } catch (err) {
        console.error('Error subiendo imagen a S3:', err.message);
        res.status(500).json({ error: 'Error al subir la imagen' });
        resolve();
      }
    });

    busboy.on('error', (err) => {
      console.error('Busboy error:', err);
      res.status(500).json({ error: 'Error procesando archivo' });
      resolve();
    });

    req.pipe(busboy);
  });
};
