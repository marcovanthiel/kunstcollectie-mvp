// pages/api/auth/login.js - Login API endpoint
import { loginUser } from '../../../lib/auth';

export default async function handler(req, res) {
  // Alleen POST requests toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode niet toegestaan' });
  }

  try {
    const { email, password } = req.body;

    // Valideer input
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail en wachtwoord zijn verplicht' });
    }

    // Login gebruiker
    const result = await loginUser(email, password);
    
    // Stuur response
    return res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: error.message || 'Inloggen mislukt' });
  }
}
