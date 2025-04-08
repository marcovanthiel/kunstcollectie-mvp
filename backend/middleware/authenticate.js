import { PrismaClient } from '@prisma/client'

// Simple authentication middleware that doesn't use JWT
const authenticate = async (req, res, next) => {
  try {
    // For development purposes, we'll use a simple API key approach
    // This is a simplified approach that bypasses JWT complexity
    const apiKey = req.headers['x-api-key'];
    
    // If no API key is provided, check for a session cookie
    if (!apiKey && req.cookies && req.cookies.session) {
      req.user = { id: req.cookies.userId, email: req.cookies.userEmail };
      return next();
    }
    
    // For direct API access, use a hardcoded API key
    if (apiKey === 'kunstcollectie-dev-key-2025') {
      req.user = { id: 'api-user', email: 'api@kunstcollectie.nl' };
      return next();
    }
    
    // If no valid authentication is found
    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication' });
  }
};

export default authenticate;
