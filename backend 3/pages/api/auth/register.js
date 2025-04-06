import prisma from '../../../lib/prisma';
import { authenticateToken, requireAdmin, hashPassword, generateToken } from '../../../lib/auth';
import { sendNewUserEmail } from '../../../lib/email';
import crypto from 'crypto';

// Gebruiker registratie API handler
const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Alleen admin kan gebruikers aanmaken
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Alleen administrators kunnen gebruikers registreren.' });
      }
      
      const { email, name, role = 'readonly' } = req.body;
      
      // Validatie
      if (!email || !name) {
        return res.status(400).json({ error: 'E-mail en naam zijn verplicht.' });
      }
      
      // Controleer of e-mail al bestaat
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Er bestaat al een gebruiker met dit e-mailadres.' });
      }
      
      // Genereer tijdelijk wachtwoord
      const tempPassword = crypto.randomBytes(8).toString('hex');
      
      // Wachtwoord hashen
      const hashedPassword = await hashPassword(tempPassword);
      
      // Gebruiker aanmaken
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
          active: true
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          createdAt: true
        }
      });
      
      // Stuur welkomst e-mail met tijdelijk wachtwoord
      await sendNewUserEmail(email, name, tempPassword);
      
      return res.status(201).json({
        user: newUser,
        message: 'Gebruiker succesvol aangemaakt. Een welkomst e-mail met inloggegevens is verzonden.'
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het registreren van de gebruiker.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
