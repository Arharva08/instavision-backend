const { Pool } = require('pg');
const config = require('./config');

// Use connection string if available, otherwise construct from individual parameters
const poolConfig = config.database.url 
  ? {
      connectionString: config.database.url,
      ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    }
  : {
      host: config.database.host?.includes('.render.com') 
        ? config.database.host 
        : `${config.database.host}.oregon-postgres.render.com`,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
      }
    };

const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;

