const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Seeding database with custom admin user...');
    
    // Use a very simple password hash format that will definitely work with PostgreSQL
    // This is a plain string representation of the hash
    const customAdminPasswordHash = '$2a$04$Vj9Dhk8NNMhH5FdSBT3LkemKUHGlF.7Uw0G4rhbvs9ORc0HO5Wkm6'; // 'Wikkie=555'
    const defaultAdminPasswordHash = '$2a$04$7Wd22iG3RNH9HEzWGFczn.OcWGeGBVK.3JBEv3SJwpGJY4.qdGgqO'; // 'admin123'
    
    console.log('Using pre-generated password hashes to avoid binary format issues');
    
    // Create custom admin user with the pre-generated hash
    const customAdmin = await prisma.user.upsert({
      where: { email: 'm@mvt.art' },
      update: {
        name: 'Custom Admin',
        password: customAdminPasswordHash,
        role: 'ADMIN',
      },
      create: {
        name: 'Custom Admin',
        email: 'm@mvt.art',
        password: customAdminPasswordHash,
        role: 'ADMIN',
      },
    });
    
    console.log('Custom admin user created:', customAdmin.email);
    
    // Create default admin user as fallback
    const defaultAdmin = await prisma.user.upsert({
      where: { email: 'admin@kunstcollectie.nl' },
      update: {
        name: 'Default Admin',
        password: defaultAdminPasswordHash,
        role: 'ADMIN',
      },
      create: {
        name: 'Default Admin',
        email: 'admin@kunstcollectie.nl',
        password: defaultAdminPasswordHash,
        role: 'ADMIN',
      },
    });
    
    console.log('Default admin user created:', defaultAdmin.email);
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error('Error in seed script:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed script execution completed');
  });
