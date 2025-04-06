// pages/api/artworks/index.js - Kunstwerken API endpoint
import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // Authenticatie middleware
  try {
    authenticateToken(req, res, async () => {
      // GET - Alle kunstwerken ophalen
      if (req.method === 'GET') {
        try {
          const artworks = await prisma.artwork.findMany({
            include: {
              artist: true,
              location: true,
              type: true
            }
          });
          return res.status(200).json(artworks);
        } catch (error) {
          console.error('Error fetching artworks:', error);
          return res.status(500).json({ message: 'Fout bij ophalen van kunstwerken' });
        }
      }
      
      // POST - Nieuw kunstwerk toevoegen
      if (req.method === 'POST') {
        try {
          const { title, description, creationDate, acquisitionDate, value, imageUrl, typeId, artistId, locationId } = req.body;
          
          // Valideer input
          if (!title) {
            return res.status(400).json({ message: 'Titel is verplicht' });
          }
          
          // Maak kunstwerk aan
          const artwork = await prisma.artwork.create({
            data: {
              title,
              description,
              creationDate: creationDate ? new Date(creationDate) : null,
              acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
              value: value ? parseFloat(value) : null,
              imageUrl,
              typeId: typeId ? parseInt(typeId) : null,
              artistId: artistId ? parseInt(artistId) : null,
              locationId: locationId ? parseInt(locationId) : null,
              createdBy: req.user.id // Gebruik ID van ingelogde gebruiker
            }
          });
          
          return res.status(201).json(artwork);
        } catch (error) {
          console.error('Error creating artwork:', error);
          return res.status(500).json({ message: 'Fout bij aanmaken van kunstwerk' });
        }
      }
      
      // Andere methodes niet toegestaan
      return res.status(405).json({ message: 'Methode niet toegestaan' });
    });
  } catch (error) {
    return res.status(401).json({ message: 'Niet geautoriseerd' });
  }
}
