const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
require('dotenv').config();

async function migrateDatabase() {
  console.log('Starting database migration and UUID conversion...');
  const prisma = new PrismaClient();
  
  try {
    // Create a direct connection to the PostgreSQL database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('Connected to PostgreSQL database directly');
    
    // Check if the User table has integer IDs
    const userTableQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
      AND column_name = 'id';
    `;
    
    const userTableResult = await client.query(userTableQuery);
    
    // Only perform migration if User table has integer IDs
    if (userTableResult.rows.length > 0 && userTableResult.rows[0].data_type === 'integer') {
      console.log('User table has integer IDs, performing migration to UUID...');
      
      // Begin transaction
      await client.query('BEGIN');
      
      try {
        // Get existing users
        const usersQuery = `SELECT * FROM "User";`;
        const usersResult = await client.query(usersQuery);
        console.log(`Found ${usersResult.rows.length} users to migrate`);
        
        // Create a backup of the User table
        console.log('Creating backup of User table...');
        await client.query(`DROP TABLE IF EXISTS "User_Backup";`);
        await client.query(`CREATE TABLE "User_Backup" AS SELECT * FROM "User";`);
        console.log('Backup created successfully');
        
        // Check for dependent tables
        const dependentTablesQuery = `
          SELECT DISTINCT tc.table_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.constraint_column_usage ccu 
            ON tc.constraint_name = ccu.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
          AND ccu.table_name = 'User';
        `;
        
        const dependentTables = await client.query(dependentTablesQuery);
        console.log('Tables with dependencies on User table:');
        dependentTables.rows.forEach(row => {
          console.log(`  ${row.table_name}`);
        });
        
        // Create a mapping of old IDs to new UUIDs
        const idMapping = {};
        for (const user of usersResult.rows) {
          const uuid = require('crypto').randomUUID();
          idMapping[user.id] = uuid;
          console.log(`Mapping user ${user.email} from ID ${user.id} to UUID ${uuid}`);
        }
        
        // Drop foreign key constraints
        for (const table of dependentTables.rows) {
          const constraintsQuery = `
            SELECT tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
              ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = $1
            AND ccu.table_name = 'User';
          `;
          
          const constraints = await client.query(constraintsQuery, [table.table_name]);
          
          for (const constraint of constraints.rows) {
            console.log(`Dropping constraint ${constraint.constraint_name} on table ${table.table_name}`);
            await client.query(`ALTER TABLE "${table.table_name}" DROP CONSTRAINT "${constraint.constraint_name}";`);
          }
        }
        
        // Drop temporary tables if they exist from previous attempts
        await client.query(`DROP TABLE IF EXISTS "User_New";`);
        
        // Create a temporary User table with UUID
        await client.query(`
          CREATE TABLE "User_New" (
            "id" UUID PRIMARY KEY,
            "email" TEXT UNIQUE NOT NULL,
            "name" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'USER',
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        
        // Migrate user data with new UUIDs
        for (const user of usersResult.rows) {
          const uuid = idMapping[user.id];
          await client.query(`
            INSERT INTO "User_New" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7);
          `, [uuid, user.email, user.name, user.password, user.role, user.createdAt, user.updatedAt]);
          
          console.log(`Migrated user ${user.email} with new UUID: ${uuid}`);
        }
        
        // Update foreign keys in dependent tables
        for (const table of dependentTables.rows) {
          // Get the foreign key column name
          const fkColumnQuery = `
            SELECT kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
              ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = $1
            AND ccu.table_name = 'User'
            AND ccu.column_name = 'id';
          `;
          
          const fkColumns = await client.query(fkColumnQuery, [table.table_name]);
          
          if (fkColumns.rows.length > 0) {
            const fkColumn = fkColumns.rows[0].column_name;
            console.log(`Updating foreign key column ${fkColumn} in table ${table.table_name}`);
            
            // Alter the column type to UUID
            await client.query(`ALTER TABLE "${table.table_name}" ALTER COLUMN "${fkColumn}" TYPE UUID USING NULL;`);
            
            // Update the values with the new UUIDs
            const tableDataQuery = `SELECT * FROM "${table.table_name}";`;
            const tableData = await client.query(tableDataQuery);
            
            for (const row of tableData.rows) {
              const oldId = row[fkColumn];
              if (oldId && idMapping[oldId]) {
                await client.query(`
                  UPDATE "${table.table_name}" 
                  SET "${fkColumn}" = $1 
                  WHERE id = $2;
                `, [idMapping[oldId], row.id]);
                console.log(`Updated ${table.table_name} row ${row.id} with new user UUID ${idMapping[oldId]}`);
              }
            }
          }
        }
        
        // Replace old User table with new one
        await client.query(`DROP TABLE "User" CASCADE;`);
        await client.query(`ALTER TABLE "User_New" RENAME TO "User";`);
        
        // Re-create foreign key constraints
        for (const table of dependentTables.rows) {
          const fkColumnQuery = `
            SELECT kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
              ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = $1
            AND ccu.table_name = 'User_Backup'
            AND ccu.column_name = 'id';
          `;
          
          const fkColumns = await client.query(fkColumnQuery, [table.table_name]);
          
          if (fkColumns.rows.length > 0) {
            const fkColumn = fkColumns.rows[0].column_name;
            const constraintName = `${table.table_name}_${fkColumn}_fkey`;
            
            console.log(`Re-creating foreign key constraint ${constraintName} on table ${table.table_name}`);
            await client.query(`
              ALTER TABLE "${table.table_name}" 
              ADD CONSTRAINT "${constraintName}" 
              FOREIGN KEY ("${fkColumn}") 
              REFERENCES "User" ("id");
            `);
          }
        }
        
        await client.query('COMMIT');
        console.log('Database schema migration completed successfully');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error during transaction, rolling back:', error);
        throw error;
      }
    } else {
      console.log('User table already has UUID IDs, no migration needed');
    }
    
    // Close the database connection
    await client.end();
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('Error during database migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Export the function for use in server.js
module.exports = migrateDatabase;

// If this script is run directly, execute the migration
if (require.main === module) {
  migrateDatabase()
    .then(() => console.log('Database migration completed'))
    .catch(e => console.error('Error in database migration:', e));
}
