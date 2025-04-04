import prisma from '../../../lib/prisma';
import { authenticateToken, requireAdmin, hashPassword } from '../../../lib/auth';

// Gebruikers API handler
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Alle gebruikers ophalen (alleen voor admins)
const getUsers = async (req, res) => {
  try {
    // Controleer of gebruiker admin is
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Toegang geweigerd. Admin rechten vereist.' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van gebruikers.' });
  }
};

// Nieuwe gebruiker aanmaken (alleen voor admins)
const createUser = async (req, res) => {
  try {
    // Controleer of gebruiker admin is
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Toegang geweigerd. Admin rechten vereist.' });
    }

    const { email, name, password, role = 'readonly', active = true } = req.body;

    // Validatie
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'E-mail, naam en wachtwoord zijn verplicht.' });
    }

    // Controleer of e-mail al bestaat
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Er bestaat al een gebruiker met dit e-mailadres.' });
    }

    // Wachtwoord hashen
    const hashedPassword = await hashPassword(password);

    // Gebruiker aanmaken
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        active
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van de gebruiker.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
