import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Connect to database
    const prisma = new PrismaClient()
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Instead of JWT, set a simple session cookie
    const sessionCookie = serialize('session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    const userIdCookie = serialize('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    const userEmailCookie = serialize('userEmail', user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })

    // Set cookies in response
    res.setHeader('Set-Cookie', [sessionCookie, userIdCookie, userEmailCookie])

    // Return user info and API key for direct API access
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      apiKey: 'kunstcollectie-dev-key-2025' // Simple API key for development
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
