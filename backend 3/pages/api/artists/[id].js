import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Specifieke kunstenaar API handler
const handler = async (req, res) => {
  const { id } = req.query;
  const artistId = parseInt(id);

  if (isNaN(artistId)) {
    return res.status(400).json({ error: 'Ongeldig kunstenaar-ID.' });
  }

  switch (req.method) {
    case 'GET':
      return getArtist(req, res, artistId);
    case 'PUT':
      return updateArtist(req, res, artistId);
    case 'DELETE':
      return deleteArtist(req, res, artistId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Specifieke kunstenaar ophalen
const getArtist = async (req, res, artistId) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        artworks: {
          select: {
            id: true,
            title: true,
            year: true,
            artworkType: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!artist) {
      return res.status(404).json({ error: 'Kunstenaar niet gevonden.' });
    }

    return res.status(200).json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de kunstenaar.' });
  }
};

// Kunstenaar bijwerken
const updateArtist = async (req, res, artistId) => {
  try {
    const { 
      name, 
      address, 
      city, 
      country, 
      email,
      phone,
      website,
      birthDate,
      deathDate,
      biography,
      portraitUrl
    } = req.body;
    
    // Controleer of kunstenaar bestaat
    const existingArtist = await prisma.artist.findUnique({
      where: { id: artistId }
    });

    if (!existingArtist) {
      return res.status(404).json({ error: 'Kunstenaar niet gevonden.' });
    }
    
    // Update data voorbereiden
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (deathDate !== undefined) updateData.deathDate = deathDate ? new Date(deathDate) : null;
    if (biography !== undefined) updateData.biography = biography;
    if (portraitUrl !== undefined) updateData.portraitUrl = portraitUrl;
    
    // Kunstenaar bijwerken
    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: updateData
    });
    
    return res.status(200).json(updatedArtist);
  } catch (error) {
    console.error('Error updating artist:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van de kunstenaar.' });
  }
};

// Kunstenaar verwijderen
const deleteArtist = async (req, res, artistId) => {
  try {
    // Controleer of kunstenaar bestaat
    const existingArtist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    });

    if (!existingArtist) {
      return res.status(404).json({ error: 'Kunstenaar niet gevonden.' });
    }
    
    // Controleer of er kunstwerken aan deze kunstenaar zijn gekoppeld
    if (existingArtist._count.artworks > 0) {
      return res.status(400).json({ 
        error: 'Deze kunstenaar kan niet worden verwijderd omdat er kunstwerken aan gekoppeld zijn.',
        artworkCount: existingArtist._count.artworks
      });
    }
    
    // Kunstenaar verwijderen
    await prisma.artist.delete({
      where: { id: artistId }
    });
    
    return res.status(200).json({ message: 'Kunstenaar succesvol verwijderd.' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van de kunstenaar.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
