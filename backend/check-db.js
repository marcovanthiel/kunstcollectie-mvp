const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    console.log('Checking database integrity...');
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users in database:`);
    users.forEach(u => console.log(` - ${u.email} (${u.role})`));
    
    // Check artworks
    const artworks = await prisma.artwork.findMany();
    console.log(`Found ${artworks.length} artworks in database`);
    
    if (artworks.length > 0) {
      console.log('Sample artwork:');
      console.log(artworks[0]);
    }
    
    console.log('Database integrity check completed successfully');
  } catch (err) {
    console.error('Database check error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
