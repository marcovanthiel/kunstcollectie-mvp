// Add seed script to package.json
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

async function main() {
  // Ensure Prisma client is properly initialized
  try {
    const prisma = new PrismaClient();
    
    console.log('Seeding database with custom admin user...');
    
    // Create custom admin user
    const customAdmin = await prisma.user.upsert({
      where: { email: 'm@mvt.art' },
      update: {
        name: 'Custom Admin',
        password: await bcryptjs.hash('Wikkie=555', 10),
        role: 'ADMIN',
      },
      create: {
        name: 'Custom Admin',
        email: 'm@mvt.art',
        password: await bcryptjs.hash('Wikkie=555', 10),
        role: 'ADMIN',
      },
    });
    
    console.log('Custom admin user created:', customAdmin.email);
    
    // Create default admin user as fallback
    const defaultAdmin = await prisma.user.upsert({
      where: { email: 'admin@kunstcollectie.nl' },
      update: {
        name: 'Default Admin',
        password: await bcryptjs.hash('admin123', 10),
        role: 'ADMIN',
      },
      create: {
        name: 'Default Admin',
        email: 'admin@kunstcollectie.nl',
        password: await bcryptjs.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
    
    console.log('Default admin user created:', defaultAdmin.email);
    
    console.log('Database seeding completed successfully');
    
    // Explicitly disconnect from the database
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Execute main function and handle any errors
main()
  .catch(e => {
    console.error('Error in seed script:', e);
    process.exit(1);
  });
