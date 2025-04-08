const { PrismaClient } = require('@prisma/client');

async function optimizePerformance() {
  console.log('Running performance optimization tests...');
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Measure database query performance
    console.log('\nTest 1: Measuring database query performance');
    
    // Create test data for performance testing
    console.log('Creating test data for performance testing...');
    const testUser = await prisma.user.findFirst({
      where: { email: 'test-admin@kunstcollectie.nl' }
    });
    
    if (!testUser) {
      console.log('No test user found, skipping performance tests');
      return;
    }
    
    // Create 50 test artworks for performance testing
    console.log('Creating 50 test artworks...');
    const startTime1 = Date.now();
    
    for (let i = 0; i < 50; i++) {
      await prisma.artwork.create({
        data: {
          title: `Performance Test Artwork ${i}`,
          description: `This is a test artwork for performance testing ${i}`,
          imageUrl: `https://example.com/test-artwork-${i}.jpg`,
          artist: `Test Artist ${i % 5}`, // Create 5 different artists
          year: 2020 + (i % 5),
          price: 1000 + (i * 100),
          sold: i % 2 === 0, // Half sold, half available
          user: {
            connect: { id: testUser.id }
          }
        }
      });
    }
    
    const endTime1 = Date.now();
    console.log(`Time to create 50 artworks: ${endTime1 - startTime1}ms`);
    
    // Test 2: Measure simple query performance
    console.log('\nTest 2: Measuring simple query performance');
    const startTime2 = Date.now();
    
    const allArtworks = await prisma.artwork.findMany({
      where: {
        title: {
          contains: 'Performance'
        }
      }
    });
    
    const endTime2 = Date.now();
    console.log(`Time to query all performance test artworks: ${endTime2 - startTime2}ms`);
    console.log(`Found ${allArtworks.length} artworks`);
    
    // Test 3: Measure complex query performance
    console.log('\nTest 3: Measuring complex query performance');
    const startTime3 = Date.now();
    
    const filteredArtworks = await prisma.artwork.findMany({
      where: {
        AND: [
          { artist: { contains: 'Test Artist 1' } },
          { price: { gte: 1500 } },
          { sold: false }
        ]
      },
      include: {
        user: true
      },
      orderBy: {
        price: 'desc'
      }
    });
    
    const endTime3 = Date.now();
    console.log(`Time to run complex query: ${endTime3 - startTime3}ms`);
    console.log(`Found ${filteredArtworks.length} artworks matching complex criteria`);
    
    // Test 4: Measure pagination performance
    console.log('\nTest 4: Measuring pagination performance');
    const startTime4 = Date.now();
    
    const page1 = await prisma.artwork.findMany({
      where: {
        title: {
          contains: 'Performance'
        }
      },
      take: 10,
      skip: 0,
      orderBy: {
        title: 'asc'
      }
    });
    
    const endTime4 = Date.now();
    console.log(`Time to query first page of 10 artworks: ${endTime4 - startTime4}ms`);
    
    const startTime5 = Date.now();
    
    const page2 = await prisma.artwork.findMany({
      where: {
        title: {
          contains: 'Performance'
        }
      },
      take: 10,
      skip: 10,
      orderBy: {
        title: 'asc'
      }
    });
    
    const endTime5 = Date.now();
    console.log(`Time to query second page of 10 artworks: ${endTime5 - startTime5}ms`);
    
    // Clean up test data
    console.log('\nCleaning up test data...');
    const startTime6 = Date.now();
    
    await prisma.artwork.deleteMany({
      where: {
        title: {
          contains: 'Performance Test Artwork'
        }
      }
    });
    
    const endTime6 = Date.now();
    console.log(`Time to delete all test artworks: ${endTime6 - startTime6}ms`);
    
    console.log('\nPerformance optimization recommendations:');
    
    // Analyze results and make recommendations
    if (endTime2 - startTime2 > 100) {
      console.log('- Add database index on artwork title for faster text searches');
    } else {
      console.log('- Simple queries are performing well, no indexing needed for basic searches');
    }
    
    if (endTime3 - startTime3 > 150) {
      console.log('- Add composite index on (artist, price, sold) for complex queries');
    } else {
      console.log('- Complex queries are performing well');
    }
    
    if (endTime5 - startTime5 > endTime4 - startTime4 * 1.5) {
      console.log('- Optimize pagination by using cursor-based pagination instead of offset pagination');
    } else {
      console.log('- Pagination performance is consistent across pages');
    }
    
    console.log('\nPerformance tests completed');
  } catch (error) {
    console.error('Error during performance optimization:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the optimization function
optimizePerformance()
  .then(() => console.log('Performance optimization completed'))
  .catch(e => console.error('Error in performance optimization:', e));
