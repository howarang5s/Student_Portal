const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is missing, authorization denied' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    console.log('Decoding of User:', decoded);
    if (!decoded) {
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }

    // Attach user data to the request object
    req.userId = decoded.userId; // Extract user ID from token
    req.userRole = decoded.role; // Extract user role from token

    // Debug logs for better visibility
    console.log('Authenticated User ID:', req.userId);
    console.log('Authenticated User Role:', req.userRole);

    // Pass control to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error.message); // Log the error for debugging
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = { authenticate };
