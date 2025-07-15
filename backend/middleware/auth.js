const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = { id: decoded.userId }; // attach user
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
