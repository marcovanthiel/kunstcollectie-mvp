const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');
require('dotenv').config();

async function fixDatabaseSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Starting database schema fix...');
    
    // Create a direct connection to the PostgreSQL database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('Connected to PostgreSQL database directly');
    
    // Check the current User table structure
    const tableInfoQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'User';
    `;
    
    const tableInfo = await client.query(tableInfoQuery);
    console.log('Current User table structure:');
    tableInfo.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Get existing users
    const usersQuery = `SELECT * FROM "User";`;
    const usersResult = await client.query(usersQuery);
    console.log(`Found ${usersResult.rows.length} users in database`);
    
    if (usersResult.rows.length > 0) {
      console.log('Sample user data:');
      console.log(usersResult.rows[0]);
    }
    
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
    
    // Modify the schema using a transaction
    await client.query('BEGIN');
    
    try {
      // Modify the User table to use UUID
      console.log('Modifying database schema to use UUIDs...');
      
      // First, drop foreign key constraints
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
      console.log('Database schema fixed successfully');
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during transaction, rolling back:', error);
      throw error;
    }
    
    // Close the database connection
    await client.end();
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('Error fixing database schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabaseSchema()
  .then(() => console.log('Database schema fix completed'))
  .catch(e => console.error('Error in database schema fix:', e));
