const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const jwt = require('jsonwebtoken');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const REQUIRED_KEYS = [
  'hero', 'nosotros', 'servicios', 'industrias',
  'capacidades', 'galeria', 'clientes', 'contacto', 'footer',
];

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw new Error('Token ausente');
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'maquinados-jaco-cms',
  });
}

module.exports = async (req, res) => {
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

  const content = req.body;

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  // Validate required top-level keys
  for (const key of REQUIRED_KEYS) {
    if (!(key in content)) {
      return res.status(400).json({ error: `Clave requerida faltante: ${key}` });
    }
  }

  // Stamp update timestamp
  content._updated = new Date().toISOString();
  content._version = (content._version || 0) + 1;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'content.json',
      Body: JSON.stringify(content, null, 2),
      ContentType: 'application/json',
      CacheControl: 'no-cache, no-store',
    });

    await s3.send(command);

    return res.status(200).json({
      ok: true,
      updated: content._updated,
      version: content._version,
    });
  } catch (err) {
    console.error('Error guardando content.json:', err.message);
    return res.status(500).json({ error: 'Error al guardar contenido' });
  }
};
