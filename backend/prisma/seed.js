const { Client } = require('pg');
require('dotenv').config();

async function main() {
  // Create a direct connection to the PostgreSQL database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to PostgreSQL database directly');

    // Log database connection info for debugging
    console.log('Database connection info:', {
      host: client.host,
      database: client.database,
      user: client.user,
      port: client.port
    });

    // Use plain text passwords that will be stored directly
    // This is not secure but will work for testing purposes
    const customAdminPassword = '$2a$04$Vj9Dhk8NNMhH5FdSBT3LkemKUHGlF.7Uw0G4rhbvs9ORc0HO5Wkm6'; // Pre-hashed 'Wikkie=555'
    const defaultAdminPassword = '$2a$04$7Wd22iG3RNH9HEzWGFczn.OcWGeGBVK.3JBEv3SJwpGJY4.qdGgqO'; // Pre-hashed 'admin123'

    console.log('Using pre-hashed password strings to avoid any hashing issues');

    // Check all possible table names (PostgreSQL is case-sensitive)
    const possibleTableNames = ['user', 'User', 'users', 'Users'];
    let tableName = null;
    
    for (const name of possibleTableNames) {
      const tableCheckQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${name}'
        );
      `;
      
      const tableResult = await client.query(tableCheckQuery);
      if (tableResult.rows[0].exists) {
        tableName = name;
        console.log(`Found existing table: "${tableName}"`);
        break;
      }
    }
    
    // If no table found, create a new one
    if (!tableName) {
      tableName = 'User'; // Use Prisma's default convention
      console.log(`No users table found, creating "${tableName}" table...`);
      
      const createTableQuery = `
        CREATE TABLE "${tableName}" (
          "id" SERIAL PRIMARY KEY,
          "email" TEXT UNIQUE NOT NULL,
          "name" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT NOT NULL DEFAULT 'USER',
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await client.query(createTableQuery);
      console.log(`"${tableName}" table created successfully`);
    }

    // Get the column names to ensure we're using the right casing
    const columnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}';
    `;
    
    const columnsResult = await client.query(columnsQuery);
    const columns = columnsResult.rows.map(row => row.column_name);
    console.log('Table columns:', columns);
    
    // Find the correct column names regardless of case
    const findColumn = (baseName) => {
      const col = columns.find(col => col.toLowerCase() === baseName.toLowerCase());
      return col || baseName; // Fallback to the base name if not found
    };
    
    const emailCol = findColumn('email');
    const nameCol = findColumn('name');
    const passwordCol = findColumn('password');
    const roleCol = findColumn('role');
    const createdAtCol = findColumn('createdat') || findColumn('created_at') || findColumn('createdAt');
    const updatedAtCol = findColumn('updatedat') || findColumn('updated_at') || findColumn('updatedAt');
    
    console.log('Using column mapping:', {
      email: emailCol,
      name: nameCol,
      password: passwordCol,
      role: roleCol,
      createdAt: createdAtCol,
      updatedAt: updatedAtCol
    });
    
    // Try a simple insert first to test the connection and table structure
    const testQuery = `
      SELECT 1 AS test;
    `;
    
    await client.query(testQuery);
    console.log('Database query test successful');
    
    // Create custom admin user with simplified approach
    // First try to delete any existing user with that email to avoid conflicts
    const deleteQuery = `
      DELETE FROM "${tableName}" 
      WHERE "${emailCol}" = $1;
    `;
    
    await client.query(deleteQuery, ['m@mvt.art']);
    await client.query(deleteQuery, ['admin@kunstcollectie.nl']);
    console.log('Cleaned up any existing users with the same emails');
    
    // Get current timestamp for updatedAt
    const now = new Date().toISOString();
    
    // Now insert the users with simple INSERT statements including updatedAt
    const customAdminQuery = `
      INSERT INTO "${tableName}" ("${emailCol}", "${nameCol}", "${passwordCol}", "${roleCol}", "${updatedAtCol}")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "id", "${emailCol}";
    `;
    
    const customAdminResult = await client.query(customAdminQuery, [
      'm@mvt.art',
      'Custom Admin',
      customAdminPassword,
      'ADMIN',
      now
    ]);
    
    console.log('Custom admin user created:', customAdminResult.rows[0][emailCol.toLowerCase()]);

    // Insert default admin user
    const defaultAdminQuery = `
      INSERT INTO "${tableName}" ("${emailCol}", "${nameCol}", "${passwordCol}", "${roleCol}", "${updatedAtCol}")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "id", "${emailCol}";
    `;
    
    const defaultAdminResult = await client.query(defaultAdminQuery, [
      'admin@kunstcollectie.nl',
      'Default Admin',
      defaultAdminPassword,
      'ADMIN',
      now
    ]);
    
    console.log('Default admin user created:', defaultAdminResult.rows[0][emailCol.toLowerCase()]);
    console.log('Database seeding completed successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
    console.error('Error details:', error.stack);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
    console.log('Database connection closed');
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
