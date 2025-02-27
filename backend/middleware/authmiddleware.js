const jwt = require('jsonwebtoken');
const { SERVER_ERROR,RESPONSE_ERROR } = require('../utils/constant');


const authenticate = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: SERVER_ERROR.HEADER_ERROR });
    }

    
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: SERVER_ERROR.TOKEN_MISSING});
    }
    

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    if (!decoded) {
      return res.status(403).json({ message: SERVER_ERROR.TOKEN_EXPIRED });
    }
    

    req.userId = decoded.userId; 
    req.userRole = decoded.role; 
    
    next();
  } catch (error) {
    
    return res.status(403).json({ message: SERVER_ERROR.AUTHENTICATE });
  }
};

module.exports = { authenticate };
