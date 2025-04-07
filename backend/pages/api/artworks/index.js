import { PrismaClient } from '@prisma/client'
import authenticate from '../../middleware/authenticate'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Apply simplified authentication middleware
    await authenticate(req, res, async () => {
      // If we reach here, authentication was successful
      
      // Connect to database
      const prisma = new PrismaClient()
      
      // Get all artworks
      // In development mode, we'll just return all artworks without user filtering
      const artworks = await prisma.artwork.findMany()

      // Return artworks
      return res.status(200).json(artworks)
    })
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
