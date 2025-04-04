import prisma from '../../../lib/prisma';
import { authenticateToken, requireAdmin, hashPassword, comparePassword, generateToken } from '../../../lib/auth';

// Login handler
async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      // Validatie
      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail en wachtwoord zijn verplicht.' });
      }
      
      // Gebruiker zoeken
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return res.status(401).json({ error: 'Ongeldige inloggegevens.' });
      }
      
      // Controleren of gebruiker actief is
      if (!user.active) {
        return res.status(401).json({ error: 'Dit account is gedeactiveerd. Neem contact op met de beheerder.' });
      }
      
      // Wachtwoord controleren
      const isPasswordValid = await comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Ongeldige inloggegevens.' });
      }
      
      // Token genereren
      const token = generateToken(user);
      
      // Gebruikersgegevens zonder wachtwoord
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het inloggen.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
}

export default handler;
