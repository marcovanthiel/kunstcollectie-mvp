const { PrismaClient } = require('@prisma/client');

async function testSearchAndFiltering() {
  console.log('Testing search and filtering functionality...');
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
    
    // Create test artworks with different attributes for search testing
    console.log('Creating test artworks for search testing...');
    
    const testArtworks = [
      {
        title: 'Sunset Landscape',
        description: 'A beautiful landscape painting of a sunset',
        artist: 'Jane Smith',
        year: 2020,
        price: 1200.00,
        sold: false
      },
      {
        title: 'Abstract Composition',
        description: 'Modern abstract art with geometric shapes',
        artist: 'John Doe',
        year: 2022,
        price: 1800.50,
        sold: true
      },
      {
        title: 'Portrait Study',
        description: 'A detailed portrait study in oil paint',
        artist: 'Jane Smith',
        year: 2021,
        price: 950.75,
        sold: false
      }
    ];
    
    // Delete existing test artworks if they exist
    console.log('Cleaning up any existing test artworks...');
    await prisma.artwork.deleteMany({
      where: {
        OR: testArtworks.map(artwork => ({ title: artwork.title }))
      }
    });
    
    // Create the test artworks
    const createdArtworks = [];
    for (const artwork of testArtworks) {
      const created = await prisma.artwork.create({
        data: {
          ...artwork,
          user: {
            connect: { id: testUser.id }
          }
        }
      });
      createdArtworks.push(created);
      console.log(`Created test artwork: ${created.title} (${created.id})`);
    }
    
    // Test 1: Search by title
    console.log('\nTest 1: Search by title containing "Abstract"');
    const titleResults = await prisma.artwork.findMany({
      where: {
        title: {
          contains: 'Abstract',
          mode: 'insensitive'
        }
      }
    });
    
    console.log(`Found ${titleResults.length} artworks with "Abstract" in title`);
    titleResults.forEach(art => console.log(` - ${art.title}`));
    
    // Test 2: Search by artist
    console.log('\nTest 2: Search by artist "Jane Smith"');
    const artistResults = await prisma.artwork.findMany({
      where: {
        artist: {
          equals: 'Jane Smith',
          mode: 'insensitive'
        }
      }
    });
    
    console.log(`Found ${artistResults.length} artworks by Jane Smith`);
    artistResults.forEach(art => console.log(` - ${art.title} (${art.artist})`));
    
    // Test 3: Filter by price range
    console.log('\nTest 3: Filter by price range (1000-2000)');
    const priceResults = await prisma.artwork.findMany({
      where: {
        price: {
          gte: 1000,
          lte: 2000
        }
      }
    });
    
    console.log(`Found ${priceResults.length} artworks in price range 1000-2000`);
    priceResults.forEach(art => console.log(` - ${art.title} ($${art.price})`));
    
    // Test 4: Filter by sold status
    console.log('\nTest 4: Filter by sold status (not sold)');
    const soldResults = await prisma.artwork.findMany({
      where: {
        sold: false
      }
    });
    
    console.log(`Found ${soldResults.length} artworks that are not sold`);
    soldResults.forEach(art => console.log(` - ${art.title} (Sold: ${art.sold})`));
    
    // Test 5: Combined search and filter
    console.log('\nTest 5: Combined search - artworks by Jane Smith not sold');
    const combinedResults = await prisma.artwork.findMany({
      where: {
        artist: {
          equals: 'Jane Smith',
          mode: 'insensitive'
        },
        sold: false
      }
    });
    
    console.log(`Found ${combinedResults.length} unsold artworks by Jane Smith`);
    combinedResults.forEach(art => console.log(` - ${art.title} (${art.artist}, Sold: ${art.sold})`));
    
    // Clean up test data
    console.log('\nCleaning up test artworks...');
    for (const artwork of createdArtworks) {
      await prisma.artwork.delete({
        where: { id: artwork.id }
      });
      console.log(`Deleted test artwork: ${artwork.title}`);
    }
    
    console.log('Search and filtering tests completed successfully');
  } catch (error) {
    console.error('Error testing search and filtering:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test function
testSearchAndFiltering()
  .then(() => console.log('Search and filtering tests completed'))
  .catch(e => console.error('Error in search and filtering tests:', e));
