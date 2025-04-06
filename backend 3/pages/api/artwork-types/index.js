import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// API handler voor artwork types
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getArtworkTypes(req, res);
    case 'POST':
      return createArtworkType(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Alle artwork types ophalen
const getArtworkTypes = async (req, res) => {
  try {
    const artworkTypes = await prisma.artworkType.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return res.status(200).json(artworkTypes);
  } catch (error) {
    console.error('Error fetching artwork types:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van kunstwerk types.' });
  }
};

// Nieuw artwork type aanmaken
const createArtworkType = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validatie
    if (!name) {
      return res.status(400).json({ error: 'Naam is verplicht.' });
    }
    
    // Controleer of type al bestaat
    const existingType = await prisma.artworkType.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingType) {
      return res.status(400).json({ error: 'Dit type bestaat al.' });
    }
    
    // Type aanmaken
    const newType = await prisma.artworkType.create({
      data: { name }
    });
    
    return res.status(201).json(newType);
  } catch (error) {
    console.error('Error creating artwork type:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van het kunstwerk type.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
