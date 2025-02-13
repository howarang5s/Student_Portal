const jwt = require('jsonwebtoken');
const { SERVER_ERROR,RESPONSE_ERROR } = require('../utils/constant');


const authenticate = (req, res, next) => {
  try {
    // Check if Authorization header is present
    console.log('Authontication');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: SERVER_ERROR.HEADER_ERROR });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: SERVER_ERROR.TOKEN_MISSING});
    }
    console.log('token');

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    if (!decoded) {
      return res.status(403).json({ message: SERVER_ERROR.TOKEN_EXPIRED });
    }
    console.log(decoded);
    // Attach user data to the request object
    req.userId = decoded.userId; // Extract user ID from token
    req.userRole = decoded.role; // Extract user role from token
    console.log(req.userId);
    console.log(req.userRole);
    // Pass control to the next middleware/route handler
    next();
  } catch (error) {
    
    return res.status(403).json({ message: SERVER_ERROR.AUTHENTICATE });
  }
};

module.exports = { authenticate };
