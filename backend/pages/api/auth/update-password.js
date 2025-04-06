import prisma from '../../../lib/prisma';
import { authenticateToken, hashPassword } from '../../../lib/auth';
import { sendPasswordResetEmail } from '../../../lib/email';
import crypto from 'crypto';

// Wachtwoord update API handler
const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { token, password } = req.body;
      
      // Validatie
      if (!token || !password) {
        return res.status(400).json({ error: 'Token en wachtwoord zijn verplicht.' });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ error: 'Wachtwoord moet minimaal 8 tekens bevatten.' });
      }
      
      // In een echte applicatie zou de token worden geverifieerd tegen een opgeslagen token in de database
      // Voor deze demo simuleren we een geldige token
      
      // Gebruiker zoeken (in een echte applicatie zou dit op basis van de token gebeuren)
      // Voor demo doeleinden gebruiken we een vaste gebruiker
      const user = await prisma.user.findFirst({
        where: { 
          email: req.body.email // In een echte applicatie zou dit uit de token komen
        }
      });
      
      if (!user) {
        // Om veiligheidsredenen geven we dezelfde melding, zelfs als de gebruiker niet bestaat
        return res.status(200).json({ message: 'Wachtwoord is succesvol bijgewerkt.' });
      }
      
      // Wachtwoord hashen
      const hashedPassword = await hashPassword(password);
      
      // Gebruiker bijwerken
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      return res.status(200).json({ message: 'Wachtwoord is succesvol bijgewerkt.' });
    } catch (error) {
      console.error('Password update error:', error);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van het wachtwoord.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

export default handler;
