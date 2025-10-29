require('dotenv').config();
const { readFileSync } = require('fs');
const { join } = require('path');
const pool = require('../config/database');

async function runMigration() {
  try {
    console.log('🔄 Running migrations...');
    
    // Migration files in order
    const migrations = [
      '001_create_users_table.sql',
      '002_add_role_to_users.sql',
      '003_update_users_registration_fields.sql',
      '004_fix_username_constraint.sql'
    ];
    
    for (const migration of migrations) {
      console.log(`Running ${migration}...`);
      const sqlPath = join(__dirname, migration);
      const sql = readFileSync(sqlPath, 'utf8');
      await pool.query(sql);
      console.log(`✓ ${migration} completed`);
    }
    
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

