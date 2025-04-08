const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  console.log('Starting automated database setup...');
  const prisma = new PrismaClient();
  
  try {
    // Generate Prisma client if needed
    console.log('Ensuring Prisma client is generated...');
    
    // Check if users exist
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    // If no users exist, create default admin users
    if (userCount === 0) {
      console.log('No users found, creating default admin users...');
      
      // Create default admin user
      const defaultAdmin = await prisma.user.create({
        data: {
          email: 'admin@kunstcollectie.nl',
          name: 'Default Admin',
          password: '$2a$04$7Wd22iG3RNH9HEzWGFczn.OcWGeGBVK.3JBEv3SJwpGJY4.qdGgqO', // pre-hashed 'admin123'
          role: 'ADMIN',
        }
      });
      console.log(`Created default admin user: ${defaultAdmin.email}`);
      
      // Create custom admin user
      const customAdmin = await prisma.user.create({
        data: {
          email: 'm@mvt.art',
          name: 'Custom Admin',
          password: '$2a$04$Vj9Dhk8NNMhH5FdSBT3LkemKUHGlF.7Uw0G4rhbvs9ORc0HO5Wkm6', // pre-hashed 'Wikkie=555'
          role: 'ADMIN',
        }
      });
      console.log(`Created custom admin user: ${customAdmin.email}`);
    }
    
    // Check if artwork types exist
    const artworkTypeCount = await prisma.artworkType.count();
    console.log(`Found ${artworkTypeCount} artwork types in database`);
    
    // If no artwork types exist, create default ones
    if (artworkTypeCount === 0) {
      console.log('No artwork types found, creating default types...');
      
      const defaultTypes = [
        { name: 'Schilderij', description: 'Een kunstwerk gemaakt met verf op doek, hout of ander materiaal' },
        { name: 'Sculptuur', description: 'Een driedimensionaal kunstwerk' },
        { name: 'Fotografie', description: 'Een kunstwerk gemaakt met fotografische technieken' },
        { name: 'Tekening', description: 'Een kunstwerk gemaakt met potlood, pen, inkt of andere tekenmediums' },
        { name: 'Digitale kunst', description: 'Een kunstwerk gemaakt met digitale technologie' }
      ];
      
      for (const type of defaultTypes) {
        await prisma.artworkType.create({
          data: type
        });
        console.log(`Created artwork type: ${type.name}`);
      }
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error during database setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup function
setupDatabase()
  .then(() => console.log('Database setup script completed'))
  .catch(e => console.error('Error in database setup script:', e));
