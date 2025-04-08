const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testUserRegistration() {
  console.log('Testing user registration flow...');
  const prisma = new PrismaClient();
  
  try {
    // Test user data
    const testUser = {
      email: 'test-user@kunstcollectie.nl',
      name: 'Test User',
      password: 'TestPassword123',
      role: 'USER'
    };
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });
    
    if (existingUser) {
      console.log(`Test user ${testUser.email} already exists, deleting...`);
      await prisma.user.delete({
        where: { email: testUser.email }
      });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    
    // Create test user
    const createdUser = await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        password: hashedPassword,
        role: testUser.role
      }
    });
    
    console.log(`Test user created successfully: ${createdUser.email} (${createdUser.id})`);
    
    // Verify user can be retrieved
    const retrievedUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });
    
    if (retrievedUser) {
      console.log('User retrieval test passed');
      
      // Test password verification
      const passwordValid = await bcrypt.compare(testUser.password, retrievedUser.password);
      console.log(`Password verification test: ${passwordValid ? 'PASSED' : 'FAILED'}`);
      
      // Clean up - delete test user
      await prisma.user.delete({
        where: { email: testUser.email }
      });
      console.log('Test user deleted successfully');
    } else {
      console.log('User retrieval test FAILED');
    }
    
    console.log('User registration flow tests completed');
  } catch (error) {
    console.error('Error testing user registration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test function
testUserRegistration()
  .then(() => console.log('User registration tests completed'))
  .catch(e => console.error('Error in user registration tests:', e));
