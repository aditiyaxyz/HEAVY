const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const auth = authHeader || (req.cookies && req.cookies.token);
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });

  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
