import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Kunstenaars API handler
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getArtists(req, res);
    case 'POST':
      return createArtist(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Alle kunstenaars ophalen met filters
const getArtists = async (req, res) => {
  try {
    const { 
      search, 
      country,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Filters opbouwen
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }
    
    // Paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Kunstenaars ophalen
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        include: {
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
      prisma.artist.count({ where })
    ]);
    
    // Formatteer de resultaten
    const formattedArtists = artists.map(artist => ({
      ...artist,
      artworkCount: artist._count.artworks
    }));
    
    return res.status(200).json({
      artists: formattedArtists,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van kunstenaars.' });
  }
};

// Nieuwe kunstenaar aanmaken
const createArtist = async (req, res) => {
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
    
    // Validatie
    if (!name) {
      return res.status(400).json({ error: 'Naam is verplicht.' });
    }
    
    // Kunstenaar aanmaken
    const newArtist = await prisma.artist.create({
      data: {
        name,
        address,
        city,
        country,
        email,
        phone,
        website,
        birthDate: birthDate ? new Date(birthDate) : null,
        deathDate: deathDate ? new Date(deathDate) : null,
        biography,
        portraitUrl
      }
    });
    
    return res.status(201).json(newArtist);
  } catch (error) {
    console.error('Error creating artist:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van de kunstenaar.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
