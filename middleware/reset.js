const jwt=require('jsonwebtoken');



const resetMiddleware = (req, res, next) => {
    const resetToken = req.headers.authorization || req.body.resetToken;
  
    if (!resetToken) {
      return res.status(401).json({ error: 'No reset token provided' });
    }
  
    jwt.verify(resetToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
  
      req._id = decoded._id;
    
      next();
    });
  };

module.exports=resetMiddleware;