import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Specifieke locatie API handler
const handler = async (req, res) => {
  const { id } = req.query;
  const locationId = parseInt(id);

  if (isNaN(locationId)) {
    return res.status(400).json({ error: 'Ongeldig locatie-ID.' });
  }

  switch (req.method) {
    case 'GET':
      return getLocation(req, res, locationId);
    case 'PUT':
      return updateLocation(req, res, locationId);
    case 'DELETE':
      return deleteLocation(req, res, locationId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Specifieke locatie ophalen
const getLocation = async (req, res, locationId) => {
  try {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        locationType: true,
        artworks: {
          select: {
            id: true,
            title: true,
            year: true,
            artist: {
              select: {
                id: true,
                name: true
              }
            },
            artworkType: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!location) {
      return res.status(404).json({ error: 'Locatie niet gevonden.' });
    }

    return res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van de locatie.' });
  }
};

// Locatie bijwerken
const updateLocation = async (req, res, locationId) => {
  try {
    const { 
      name, 
      address, 
      postalCode, 
      city, 
      country,
      typeId,
      notes
    } = req.body;
    
    // Controleer of locatie bestaat
    const existingLocation = await prisma.location.findUnique({
      where: { id: locationId }
    });

    if (!existingLocation) {
      return res.status(404).json({ error: 'Locatie niet gevonden.' });
    }
    
    // Update data voorbereiden
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (address !== undefined) updateData.address = address;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (typeId !== undefined) updateData.typeId = parseInt(typeId);
    if (notes !== undefined) updateData.notes = notes;
    
    // Locatie bijwerken
    const updatedLocation = await prisma.location.update({
      where: { id: locationId },
      data: updateData,
      include: {
        locationType: true
      }
    });
    
    return res.status(200).json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van de locatie.' });
  }
};

// Locatie verwijderen
const deleteLocation = async (req, res, locationId) => {
  try {
    // Controleer of locatie bestaat
    const existingLocation = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    });

    if (!existingLocation) {
      return res.status(404).json({ error: 'Locatie niet gevonden.' });
    }
    
    // Controleer of er kunstwerken aan deze locatie zijn gekoppeld
    if (existingLocation._count.artworks > 0) {
      return res.status(400).json({ 
        error: 'Deze locatie kan niet worden verwijderd omdat er kunstwerken aan gekoppeld zijn.',
        artworkCount: existingLocation._count.artworks
      });
    }
    
    // Locatie verwijderen
    await prisma.location.delete({
      where: { id: locationId }
    });
    
    return res.status(200).json({ message: 'Locatie succesvol verwijderd.' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van de locatie.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
