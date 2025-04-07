// pages/api/auth/register.js - Registratie API endpoint
import { createUser } from '../../../lib/auth';

export default async function handler(req, res) {
  // Alleen POST requests toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode niet toegestaan' });
  }

  try {
    const { email, name, password, role } = req.body;

    // Valideer input
    if (!email || !name || !password) {
      return res.status(400).json({ 
        message: 'E-mail, naam en wachtwoord zijn verplicht' 
      });
    }

    // Maak gebruiker aan
    const user = await createUser({ email, name, password, role });
    
    // Stuur response
    return res.status(201).json({ 
      message: 'Gebruiker succesvol aangemaakt', 
      user 
    });
  } catch (error) {
    console.error('Registratie error:', error);
    return res.status(400).json({ 
      message: error.message || 'Registratie mislukt' 
    });
  }
}
