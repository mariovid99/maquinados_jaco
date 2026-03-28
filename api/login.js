const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Contraseña requerida' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env var not set');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET env var not set');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  // Timing-safe comparison to prevent timing attacks
  let match = false;
  try {
    const given = Buffer.from(password, 'utf8');
    const expected = Buffer.from(adminPassword, 'utf8');
    // timingSafeEqual requires same length — pad if needed
    if (given.length === expected.length) {
      match = crypto.timingSafeEqual(given, expected);
    }
  } catch {
    match = false;
  }

  if (!match) {
    // Fixed delay to prevent timing-based enumeration
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ role: 'admin' }, jwtSecret, {
    expiresIn: '8h',
    issuer: 'maquinados-jaco-cms',
  });

  return res.status(200).json({ token });
};
