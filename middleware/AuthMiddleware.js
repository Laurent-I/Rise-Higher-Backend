const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { StatusCodes } = require('http-status-codes');

// Authentication middleware
exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token expired' });
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    console.log(req.userRole)
    next();
  });
};

exports.authorizeRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.userRole)) {
      return res.status(StatusCodes.FORBIDDEN).json({message: "Not Authorized To Access this page" })
  }
  next()
}
