const jwt = require('jsonwebtoken');
const {server_Error} = require('../utils/error_and_responses');

const authenticate = (req, res, next) => {
  try {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: server_Error.header_error });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: server_Error.token_missing});
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    if (!decoded) {
      return res.status(403).json({ message: server_Error.token_expired });
    }

    // Attach user data to the request object
    req.userId = decoded.userId; // Extract user ID from token
    req.userRole = decoded.role; // Extract user role from token

    // Pass control to the next middleware/route handler
    next();
  } catch (error) {
    return res.status(403).json({ message: server_Error.authenticate_error });
  }
};

module.exports = { authenticate };
