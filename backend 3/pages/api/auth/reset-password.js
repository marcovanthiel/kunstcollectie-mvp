import prisma from '../../../lib/prisma';
import { authenticateToken, requireAdmin, hashPassword } from '../../../lib/auth';
import { sendPasswordResetEmail } from '../../../lib/email';

// Password reset request handler
async function requestHandler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      
      // Validatie
      if (!email) {
        return res.status(400).json({ error: 'E-mail is verplicht.' });
      }
      
      // Gebruiker zoeken
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      // We geven geen foutmelding als de gebruiker niet bestaat om privacy redenen
      if (user && user.active) {
        // In een echte applicatie zou hier een unieke token worden gegenereerd
        // en opgeslagen in de database met een vervaldatum
        const resetToken = Math.random().toString(36).substring(2, 15);
        
        // Stuur e-mail met reset link
        await sendPasswordResetEmail(user.email, resetToken);
      }
      
      // We sturen altijd een succes bericht, zelfs als de gebruiker niet bestaat
      // om privacy redenen
      return res.status(200).json({ 
        message: 'Als er een account bestaat met dit e-mailadres, dan is er een wachtwoord reset link verzonden.' 
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het verwerken van uw verzoek.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
}

// Middleware toepassen
export default requestHandler;
