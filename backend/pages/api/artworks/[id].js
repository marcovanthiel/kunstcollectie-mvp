import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';

// Specifiek kunstwerk API handler
const handler = async (req, res) => {
  const { id } = req.query;
  const artworkId = parseInt(id);

  if (isNaN(artworkId)) {
    return res.status(400).json({ error: 'Ongeldig kunstwerk-ID.' });
  }

  switch (req.method) {
    case 'GET':
      return getArtwork(req, res, artworkId);
    case 'PUT':
      return updateArtwork(req, res, artworkId);
    case 'DELETE':
      return deleteArtwork(req, res, artworkId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Specifiek kunstwerk ophalen
const getArtwork = async (req, res, artworkId) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
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
        images: true,
        attachments: true
      }
    });

    if (!artwork) {
      return res.status(404).json({ error: 'Kunstwerk niet gevonden.' });
    }

    return res.status(200).json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het ophalen van het kunstwerk.' });
  }
};

// Kunstwerk bijwerken
const updateArtwork = async (req, res, artworkId) => {
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
    
    // Controleer of kunstwerk bestaat
    const existingArtwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!existingArtwork) {
      return res.status(404).json({ error: 'Kunstwerk niet gevonden.' });
    }
    
    // Update data voorbereiden
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (artistId !== undefined) updateData.artistId = parseInt(artistId);
    if (typeId !== undefined) updateData.typeId = parseInt(typeId);
    if (height !== undefined) updateData.height = height ? parseFloat(height) : null;
    if (width !== undefined) updateData.width = width ? parseFloat(width) : null;
    if (depth !== undefined) updateData.depth = depth ? parseFloat(depth) : null;
    if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null;
    if (year !== undefined) updateData.year = year ? parseInt(year) : null;
    if (estimated !== undefined) updateData.estimated = estimated;
    if (isEdition !== undefined) updateData.isEdition = isEdition;
    if (editionDesc !== undefined) updateData.editionDesc = editionDesc;
    if (isSigned !== undefined) updateData.isSigned = isSigned;
    if (signatureDesc !== undefined) updateData.signatureDesc = signatureDesc;
    if (description !== undefined) updateData.description = description;
    if (locationId !== undefined) updateData.locationId = locationId ? parseInt(locationId) : null;
    if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate ? new Date(purchaseDate) : null;
    if (purchasePrice !== undefined) updateData.purchasePrice = purchasePrice ? parseFloat(purchasePrice) : null;
    if (supplier !== undefined) updateData.supplier = supplier;
    if (marketValue !== undefined) updateData.marketValue = marketValue ? parseFloat(marketValue) : null;
    if (insuredValue !== undefined) updateData.insuredValue = insuredValue ? parseFloat(insuredValue) : null;
    
    // Kunstwerk bijwerken
    const updatedArtwork = await prisma.artwork.update({
      where: { id: artworkId },
      data: updateData,
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
        }
      }
    });
    
    return res.status(200).json(updatedArtwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het bijwerken van het kunstwerk.' });
  }
};

// Kunstwerk verwijderen
const deleteArtwork = async (req, res, artworkId) => {
  try {
    // Controleer of kunstwerk bestaat
    const existingArtwork = await prisma.artwork.findUnique({
      where: { id: artworkId }
    });

    if (!existingArtwork) {
      return res.status(404).json({ error: 'Kunstwerk niet gevonden.' });
    }
    
    // Kunstwerk verwijderen (cascade delete voor images en attachments is ingesteld in schema)
    await prisma.artwork.delete({
      where: { id: artworkId }
    });
    
    return res.status(200).json({ message: 'Kunstwerk succesvol verwijderd.' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return res.status(500).json({ error: 'Er is een fout opgetreden bij het verwijderen van het kunstwerk.' });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
