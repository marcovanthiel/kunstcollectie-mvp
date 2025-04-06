import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Rapportage API handler
const handler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getReport(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Rapportage genereren
const getReport = async (req, res) => {
  try {
    const { 
      type, 
      artistId, 
      locationId, 
      typeId,
      startDate,
      endDate,
      minValue,
      maxValue
    } = req.query;
    
    // Validatie
    if (!type) {
      return res.status(400).json({ error: 'Rapport type is verplicht.' });
    }
    
    // Filters opbouwen
    const where = {};
    
    if (artistId) where.artistId = parseInt(artistId);
    if (locationId) where.locationId = parseInt(locationId);
    if (typeId) where.typeId = parseInt(typeId);
    
    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = new Date(startDate);
      if (endDate) where.purchaseDate.lte = new Date(endDate);
    }
    
    if (minValue || maxValue) {
      where.marketValue = {};
      if (minValue) where.marketValue.gte = parseFloat(minValue);
      if (maxValue) where.marketValue.lte = parseFloat(maxValue);
    }
    
    // Verschillende rapport types
    switch (type) {
      case 'inventory':
        return await generateInventoryReport(res, where);
      case 'value':
        return await generateValueReport(res, where);
      case 'artist':
        return await generateArtistReport(res, where);
      case 'location':
        return await generateLocationReport(res, where);
      default:
        return res.status(400).json({ error: 'Ongeldig rapport type.' });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het genereren van het rapport.' });
  }
};

// Inventarisatie rapport
const generateInventoryReport = async (res, where) => {
  const artworks = await prisma.artwork.findMany({
    where,
    include: {
      artist: {
        select: {
          name: true
        }
      },
      artworkType: {
        select: {
          name: true
        }
      },
      location: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  });
  
  const report = {
    title: 'Inventarisatie Overzicht',
    generatedAt: new Date(),
    totalItems: artworks.length,
    items: artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist.name,
      type: artwork.artworkType.name,
      year: artwork.year,
      dimensions: artwork.height && artwork.width ? 
        `${artwork.height} x ${artwork.width}${artwork.depth ? ' x ' + artwork.depth : ''} cm` : 
        'Onbekend',
      location: artwork.location?.name || 'Onbekend'
    }))
  };
  
  return res.status(200).json(report);
};

// Waarde rapport
const generateValueReport = async (res, where) => {
  const artworks = await prisma.artwork.findMany({
    where,
    select: {
      id: true,
      title: true,
      artist: {
        select: {
          name: true
        }
      },
      purchaseDate: true,
      purchasePrice: true,
      marketValue: true,
      insuredValue: true
    },
    orderBy: {
      marketValue: 'desc'
    }
  });
  
  const totalPurchaseValue = artworks.reduce((sum, artwork) => sum + (artwork.purchasePrice || 0), 0);
  const totalMarketValue = artworks.reduce((sum, artwork) => sum + (artwork.marketValue || 0), 0);
  const totalInsuredValue = artworks.reduce((sum, artwork) => sum + (artwork.insuredValue || 0), 0);
  
  const report = {
    title: 'Waarde Rapportage',
    generatedAt: new Date(),
    totalItems: artworks.length,
    summary: {
      totalPurchaseValue,
      totalMarketValue,
      totalInsuredValue,
      valueChange: totalPurchaseValue > 0 ? 
        ((totalMarketValue - totalPurchaseValue) / totalPurchaseValue * 100).toFixed(2) + '%' : 
        'N/A'
    },
    items: artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist.name,
      purchaseDate: artwork.purchaseDate,
      purchasePrice: artwork.purchasePrice,
      marketValue: artwork.marketValue,
      insuredValue: artwork.insuredValue,
      valueChange: artwork.purchasePrice && artwork.marketValue ? 
        ((artwork.marketValue - artwork.purchasePrice) / artwork.purchasePrice * 100).toFixed(2) + '%' : 
        'N/A'
    }))
  };
  
  return res.status(200).json(report);
};

// Kunstenaars rapport
const generateArtistReport = async (res, where) => {
  // Haal alle kunstenaars op met hun kunstwerken die aan de criteria voldoen
  const artists = await prisma.artist.findMany({
    include: {
      artworks: {
        where,
        include: {
          artworkType: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
  
  // Filter kunstenaars zonder kunstwerken die aan de criteria voldoen
  const filteredArtists = artists.filter(artist => artist.artworks.length > 0);
  
  // Bereken totale waarde per kunstenaar
  const artistsWithValues = filteredArtists.map(artist => {
    const totalValue = artist.artworks.reduce((sum, artwork) => sum + (artwork.marketValue || 0), 0);
    const artworksByType = {};
    
    // Groepeer kunstwerken per type
    artist.artworks.forEach(artwork => {
      const typeName = artwork.artworkType.name;
      if (!artworksByType[typeName]) {
        artworksByType[typeName] = [];
      }
      artworksByType[typeName].push(artwork);
    });
    
    return {
      id: artist.id,
      name: artist.name,
      artworkCount: artist.artworks.length,
      totalValue,
      artworksByType: Object.entries(artworksByType).map(([type, artworks]) => ({
        type,
        count: artworks.length,
        items: artworks.map(artwork => ({
          id: artwork.id,
          title: artwork.title,
          year: artwork.year,
          value: artwork.marketValue
        }))
      }))
    };
  });
  
  const report = {
    title: 'Kunstenaars Analyse',
    generatedAt: new Date(),
    totalArtists: filteredArtists.length,
    totalArtworks: filteredArtists.reduce((sum, artist) => sum + artist.artworks.length, 0),
    artists: artistsWithValues
  };
  
  return res.status(200).json(report);
};

// Locatie rapport
const generateLocationReport = async (res, where) => {
  // Haal alle locaties op met hun kunstwerken die aan de criteria voldoen
  const locations = await prisma.location.findMany({
    include: {
      locationType: true,
      artworks: {
        where,
        include: {
          artist: {
            select: {
              name: true
            }
          },
          artworkType: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
  
  // Filter locaties zonder kunstwerken die aan de criteria voldoen
  const filteredLocations = locations.filter(location => location.artworks.length > 0);
  
  // Bereken totale waarde per locatie
  const locationsWithValues = filteredLocations.map(location => {
    const totalValue = location.artworks.reduce((sum, artwork) => sum + (artwork.marketValue || 0), 0);
    
    return {
      id: location.id,
      name: location.name,
      type: location.locationType.name,
      address: location.address,
      city: location.city,
      artworkCount: location.artworks.length,
      totalValue,
      artworks: location.artworks.map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist.name,
        type: artwork.artworkType.name,
        year: artwork.year,
        value: artwork.marketValue
      }))
    };
  });
  
  const report = {
    title: 'Locatie Overzicht',
    generatedAt: new Date(),
    totalLocations: filteredLocations.length,
    totalArtworks: filteredLocations.reduce((sum, location) => sum + location.artworks.length, 0),
    locations: locationsWithValues
  };
  
  return res.status(200).json(report);
};

// Middleware toepassen
export default authenticateToken(handler);
