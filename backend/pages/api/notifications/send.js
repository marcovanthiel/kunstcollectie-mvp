import prisma from '../../../lib/prisma';
import { authenticateToken } from '../../../lib/auth';
import { sendChangeNotificationEmail } from '../../../lib/email';

// API handler voor het versturen van notificaties bij wijzigingen
const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { entityType, entityId, action } = req.body;
      
      // Validatie
      if (!entityType || !entityId || !action) {
        return res.status(400).json({ error: 'EntityType, entityId en action zijn verplicht.' });
      }
      
      // Controleer of de actie geldig is
      const validActions = ['toegevoegd', 'bijgewerkt', 'verwijderd'];
      if (!validActions.includes(action)) {
        return res.status(400).json({ error: 'Ongeldige actie.' });
      }
      
      // Haal de entiteit op
      let entity;
      let entityName;
      
      switch (entityType) {
        case 'Kunstwerk':
          entity = await prisma.artwork.findUnique({
            where: { id: parseInt(entityId) },
            include: { artist: true }
          });
          entityName = entity?.title || 'Onbekend kunstwerk';
          break;
        case 'Kunstenaar':
          entity = await prisma.artist.findUnique({
            where: { id: parseInt(entityId) }
          });
          entityName = entity?.name || 'Onbekende kunstenaar';
          break;
        case 'Locatie':
          entity = await prisma.location.findUnique({
            where: { id: parseInt(entityId) }
          });
          entityName = entity?.name || 'Onbekende locatie';
          break;
        default:
          return res.status(400).json({ error: 'Ongeldig entityType.' });
      }
      
      if (!entity && action !== 'verwijderd') {
        return res.status(404).json({ error: `${entityType} niet gevonden.` });
      }
      
      // Haal alle actieve admin gebruikers op om notificaties te sturen
      const adminUsers = await prisma.user.findMany({
        where: {
          role: 'admin',
          active: true
        }
      });
      
      // Stuur notificaties naar alle admins
      const emailPromises = adminUsers.map(user => 
        sendChangeNotificationEmail(user.email, user.name, entityType, entityName, action)
      );
      
      await Promise.all(emailPromises);
      
      return res.status(200).json({ 
        message: `Notificaties verstuurd naar ${adminUsers.length} gebruikers.`,
        recipients: adminUsers.length
      });
    } catch (error) {
      console.error('Notification error:', error);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het versturen van notificaties.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Methode ${req.method} niet toegestaan` });
  }
};

// Middleware toepassen
export default authenticateToken(handler);
