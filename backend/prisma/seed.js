// Add seed script to package.json
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Seeding database with custom admin user...');
    
    // Create custom admin user - using a simpler password hash to avoid binary format issues
    const customAdmin = await prisma.user.upsert({
      where: { email: 'm@mvt.art' },
      update: {
        name: 'Custom Admin',
        // Use a simpler hash format to avoid binary data format issues
        password: await bcryptjs.hashSync('Wikkie=555', 8),
        role: 'ADMIN',
      },
      create: {
        name: 'Custom Admin',
        email: 'm@mvt.art',
        // Use a simpler hash format to avoid binary data format issues
        password: await bcryptjs.hashSync('Wikkie=555', 8),
        role: 'ADMIN',
      },
    });
    
    console.log('Custom admin user created:', customAdmin.email);
    
    // Create default admin user as fallback
    const defaultAdmin = await prisma.user.upsert({
      where: { email: 'admin@kunstcollectie.nl' },
      update: {
        name: 'Default Admin',
        // Use a simpler hash format to avoid binary data format issues
        password: await bcryptjs.hashSync('admin123', 8),
        role: 'ADMIN',
      },
      create: {
        name: 'Default Admin',
        email: 'admin@kunstcollectie.nl',
        // Use a simpler hash format to avoid binary data format issues
        password: await bcryptjs.hashSync('admin123', 8),
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
  });
