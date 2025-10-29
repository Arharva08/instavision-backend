const bcrypt = require('bcryptjs');
const pool = require('../config/database');
require('dotenv').config();

/**
 * Seed script to create initial admin user
 * Run this after running the migrations
 * Usage: node migrations/seed_admin.js
 */

const seedAdmin = async () => {
  try {
    console.log('Creating admin user...');

    // Admin user details (you can modify these)
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@instavision.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminData.email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, first_name, last_name, role`,
      [adminData.username, adminData.email, hashedPassword, adminData.first_name, adminData.last_name, adminData.role]
    );

    const admin = result.rows[0];

    console.log('✓ Admin user created successfully!');
    console.log('Admin Details:');
    console.log(`  Username: ${admin.username}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${adminData.password} (Please change this!)`);
    console.log(`  Role: ${admin.role}`);
    console.log('');
    console.log('IMPORTANT: Please change the default admin password after first login!');

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
};

// Run the seed
seedAdmin();

