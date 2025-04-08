import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Naam, email en wachtwoord zijn verplicht' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Er bestaat al een gebruiker met dit e-mailadres' });
    }

    // Hash password using bcryptjs
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate API key for alternative authentication
    const apiKey = jwt.sign(
      { userId: user.id, type: 'api_key' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, COOKIE_OPTIONS));

    // Return user info (but not the password)
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.status(201).json({
      message: 'Registratie succesvol',
      user: userWithoutPassword,
      apiKey
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Er is een fout opgetreden bij het registreren' });
  }
}
