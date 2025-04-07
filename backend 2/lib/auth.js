// lib/auth.js - Authenticatie functies
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

// Wachtwoord hashen
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Wachtwoord verifiëren
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// JWT token genereren
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token verloopt na 7 dagen
  });
}

// Middleware om JWT token te verifiëren
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Toegang geweigerd. Geen token opgegeven.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Ongeldige token.' });
  }
}

// Middleware om admin rechten te controleren
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Toegang geweigerd. Admin rechten vereist.' });
  }
  next();
}

// Gebruiker aanmaken
export async function createUser(userData) {
  const { email, name, password, role = 'user' } = userData;
  
  // Controleer of gebruiker al bestaat
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error('Gebruiker met dit e-mailadres bestaat al.');
  }
  
  // Hash wachtwoord
  const hashedPassword = await hashPassword(password);
  
  // Maak gebruiker aan
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role
    }
  });
  
  // Verwijder wachtwoord uit response
  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}

// Gebruiker inloggen
export async function loginUser(email, password) {
  // Zoek gebruiker
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error('Ongeldige inloggegevens.');
  }
  
  // Verifieer wachtwoord
  const isPasswordValid = await verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Ongeldige inloggegevens.');
  }
  
  // Genereer token
  const token = generateToken(user);
  
  // Verwijder wachtwoord uit response
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token
  };
}
