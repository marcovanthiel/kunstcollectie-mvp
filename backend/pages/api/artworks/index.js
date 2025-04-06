import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Kunstwerken API handler
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getArtworks(req, res);
    case 'POST':
      return createArtwork(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Alle kunstwerken ophalen met filters
const getArtworks = async (req, res) => {
  try {
    const { 
      artistId, 
      locationId, 
      typeId, 
      search, 
      minValue, 
      maxValue,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Filters opbouwen
    const where = {};
    
    if (artistId) where.artistId = parseInt(artistId);
    if (locationId) where.locationId = parseInt(locationId);
    if (typeId) where.typeId = parseInt(typeId);
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (minValue) where.marketValue = { gte: parseFloat(minValue) };
    if (maxValue) where.marketValue = { ...where.marketValue, lte: parseFloat(maxValue) };
    
    // Paginering
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Kunstwerken ophalen
    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
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
          },
          location: {
            select: {
              id: true,
              name: true
            }
          },
          images: {
            where: {
              isPrimary: true
            },
            take: 1
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          title: 'asc'
        }
      }),
      prisma.artwork.count({ where })
    ]);
    
    return res.status(200).json({
      artworks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van kunstwerken.' });
  }
};

// Nieuw kunstwerk aanmaken
const createArtwork = async (req, res) => {
  try {
    const { 
      title, 
      artistId, 
      typeId, 
      height, 
      width, 
      depth, 
      weight,
      year,
      estimated,
      isEdition,
      editionDesc,
      isSigned,
      signatureDesc,
      description,
      locationId,
      purchaseDate,
      purchasePrice,
      supplier,
      marketValue,
      insuredValue
    } = req.body;
    
    // Validatie
    if (!title || !artistId || !typeId) {
      return res.status(400).json({ error: 'Titel, kunstenaar en type zijn verplicht.' });
    }
    
    // Kunstwerk aanmaken
    const newArtwork = await prisma.artwork.create({
      data: {
        title,
        artistId: parseInt(artistId),
        typeId: parseInt(typeId),
        height: height ? parseFloat(height) : null,
        width: width ? parseFloat(width) : null,
        depth: depth ? parseFloat(depth) : null,
        weight: weight ? parseFloat(weight) : null,
        year: year ? parseInt(year) : null,
        estimated: estimated || false,
        isEdition: isEdition || false,
        editionDesc,
        isSigned: isSigned || false,
        signatureDesc,
        description,
        locationId: locationId ? parseInt(locationId) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
        supplier,
        marketValue: marketValue ? parseFloat(marketValue) : null,
        insuredValue: insuredValue ? parseFloat(insuredValue) : null
      }
    });
    
    return res.status(201).json(newArtwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het aanmaken van het kunstwerk.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
