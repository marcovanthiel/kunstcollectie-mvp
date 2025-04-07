import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Connect to database
    const prisma = new PrismaClient()
    
    // Get all artworks
    const artworks = await prisma.artwork.findMany({
      where: {
        userId: decoded.id
      }
    })

    // Return artworks
    return res.status(200).json(artworks)
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
