const { PrismaClient } = require('@prisma/client');

async function testArtworkManagement() {
  console.log('Testing artwork management features...');
  const prisma = new PrismaClient();
  
  try {
    // First, get or create a test user
    let testUser = await prisma.user.findFirst({
      where: { email: 'test-admin@kunstcollectie.nl' }
    });
    
    if (!testUser) {
      console.log('Creating test admin user...');
      testUser = await prisma.user.create({
        data: {
          email: 'test-admin@kunstcollectie.nl',
          name: 'Test Admin',
          password: '$2a$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // hashed 'admin123'
          role: 'ADMIN'
        }
      });
      console.log(`Test admin user created: ${testUser.id}`);
    } else {
      console.log(`Using existing test admin user: ${testUser.id}`);
    }
    
    // Test artwork creation
    console.log('Testing artwork creation...');
    const testArtwork = await prisma.artwork.create({
      data: {
        title: 'Test Artwork',
        description: 'This is a test artwork for testing management features',
        imageUrl: 'https://example.com/test-artwork.jpg',
        artist: 'Test Artist',
        year: 2025,
        price: 1000.50,
        sold: false,
        user: {
          connect: { id: testUser.id }
        }
      }
    });
    
    console.log(`Test artwork created: ${testArtwork.id}`);
    
    // Test artwork retrieval
    console.log('Testing artwork retrieval...');
    const retrievedArtwork = await prisma.artwork.findUnique({
      where: { id: testArtwork.id },
      include: { user: true }
    });
    
    if (retrievedArtwork) {
      console.log('Artwork retrieval test passed');
      console.log(`Retrieved artwork: ${retrievedArtwork.title} by ${retrievedArtwork.artist}`);
      console.log(`Created by user: ${retrievedArtwork.user?.name || 'unknown'}`);
    } else {
      console.log('Artwork retrieval test FAILED');
    }
    
    // Test artwork update
    console.log('Testing artwork update...');
    const updatedArtwork = await prisma.artwork.update({
      where: { id: testArtwork.id },
      data: {
        title: 'Updated Test Artwork',
        price: 2000.75
      }
    });
    
    console.log(`Artwork updated: ${updatedArtwork.title} (${updatedArtwork.price})`);
    
    // Test artwork deletion
    console.log('Testing artwork deletion...');
    await prisma.artwork.delete({
      where: { id: testArtwork.id }
    });
    
    // Verify deletion
    const deletedArtwork = await prisma.artwork.findUnique({
      where: { id: testArtwork.id }
    });
    
    if (!deletedArtwork) {
      console.log('Artwork deletion test passed');
    } else {
      console.log('Artwork deletion test FAILED');
    }
    
    console.log('Artwork management tests completed successfully');
  } catch (error) {
    console.error('Error testing artwork management:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test function
testArtworkManagement()
  .then(() => console.log('Artwork management tests completed'))
  .catch(e => console.error('Error in artwork management tests:', e));
