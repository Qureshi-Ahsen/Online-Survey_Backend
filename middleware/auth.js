const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decodedToken) {
      throw new Error('Invalid user');
    }

    req.user = {_id:decodedToken._id,name:decodedToken.name,email:decodedToken.email};
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

 
module.exports = authMiddleware;