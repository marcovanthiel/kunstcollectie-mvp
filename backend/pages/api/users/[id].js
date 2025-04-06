import prisma from '../../../lib/prisma';
import { authenticateToken, requireAdmin } from '../../../lib/auth';

// Specifieke gebruiker API handler
const handler = async (req, res) => {
  const { id } = req.query;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Ongeldig gebruikers-ID.' });
  }

  switch (req.method) {
    case 'GET':
      return getUser(req, res, userId);
    case 'PUT':
      return updateUser(req, res, userId);
    case 'DELETE':
      return deleteUser(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Specifieke gebruiker ophalen
const getUser = async (req, res, userId) => {
  try {
    // Controleer of gebruiker admin is of zichzelf opvraagt
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Toegang geweigerd.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de gebruiker.' });
  }
};

// Gebruiker bijwerken
const updateUser = async (req, res, userId) => {
  try {
    // Controleer of gebruiker admin is of zichzelf bijwerkt
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Toegang geweigerd.' });
    }

    const { name, email, role, active } = req.body;
    
    // Alleen admins mogen role en active status wijzigen
    if ((role !== undefined || active !== undefined) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Alleen administrators kunnen rollen en actieve status wijzigen.' });
    }

    // Controleer of gebruiker bestaat
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden.' });
    }

    // Update data voorbereiden
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined && req.user.role === 'admin') updateData.email = email;
    if (role !== undefined && req.user.role === 'admin') updateData.role = role;
    if (active !== undefined && req.user.role === 'admin') updateData.active = active;

    // Gebruiker bijwerken
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van de gebruiker.' });
  }
};

// Gebruiker verwijderen (alleen voor admins)
const deleteUser = async (req, res, userId) => {
  try {
    // Controleer of gebruiker admin is
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Toegang geweigerd. Admin rechten vereist.' });
    }

    // Controleer of gebruiker bestaat
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'Gebruiker niet gevonden.' });
    }

    // Voorkom dat een admin zichzelf verwijdert
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'U kunt uw eigen account niet verwijderen.' });
    }

    // Gebruiker verwijderen
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.status(200).json({ message: 'Gebruiker succesvol verwijderd.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van de gebruiker.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
