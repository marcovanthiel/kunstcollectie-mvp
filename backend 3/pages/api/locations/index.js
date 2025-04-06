import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Locaties API handler
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getLocations(req, res);
    case 'POST':
      return createLocation(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Alle locaties ophalen met filters
const getLocations = async (req, res) => {
  try {
    const { 
      search, 
      type,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Filters opbouwen
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (type) {
      where.typeId = parseInt(type);
    }
    
    // Paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Locaties ophalen
    const [locations, total] = await Promise.all([
      prisma.location.findMany({
        where,
        include: {
          locationType: true,
          _count: {
            select: { artworks: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.location.count({ where })
    ]);
    
    // Formatteer de resultaten
    const formattedLocations = locations.map(location => ({
      ...location,
      artworkCount: location._count.artworks
    }));
    
    return res.status(200).json({
      locations: formattedLocations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van locaties.' });
  }
};

// Nieuwe locatie aanmaken
const createLocation = async (req, res) => {
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
    
    // Validatie
    if (!name || !address || !city || !typeId) {
      return res.status(400).json({ error: 'Naam, adres, stad en type zijn verplicht.' });
    }
    
    // Locatie aanmaken
    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
        postalCode,
        city,
        country,
        typeId: parseInt(typeId),
        notes
      },
      include: {
        locationType: true
      }
    });
    
    return res.status(201).json(newLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van de locatie.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
