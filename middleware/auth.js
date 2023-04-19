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


const resetmiddleware = (req, res, next) => {
  const resetToken = req.headers.authorization || req.body.resetToken;

  if (!resetToken) {
    return res.status(401).json({ error: 'No reset token provided' });
  }

  jwt.verify(resetToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    };
    
    next();
  });
};

 
module.exports = authMiddleware;