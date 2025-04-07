import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Check if user is authenticated via cookies
    if (req.cookies && req.cookies.session === 'authenticated') {
      const userId = req.cookies.userId;
      const userEmail = req.cookies.userEmail;
      
      return res.status(200).json({
        authenticated: true,
        user: {
          id: userId,
          email: userEmail,
          name: 'User' // We don't store name in cookie, so use generic name
        }
      });
    }
    
    // Check if user is authenticated via API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey === 'kunstcollectie-dev-key-2025') {
      return res.status(200).json({
        authenticated: true,
        user: {
          id: 'api-user',
          email: 'api@kunstcollectie.nl',
          name: 'API User'
        }
      });
    }
    
    // Not authenticated
    return res.status(401).json({ authenticated: false });
  } catch (error) {
    console.error('Authentication check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
