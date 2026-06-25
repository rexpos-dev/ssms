/**
 * Seed Demo Users Script
 * Populates the database with demo user accounts for testing
 *
 * Demo Credentials:
 * - admin@school.edu / demo123
 * - teacher@school.edu / demo123
 * - student@school.edu / demo123
 * - parent@school.edu / demo123
 */

const pool = require('../config/database');
const { hashPassword } = require('../middleware/auth');

const DEMO_USERS = [
  {
    email: 'admin@school.edu',
    password: 'demo123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
  },
  {
    email: 'teacher@school.edu',
    password: 'demo123',
    first_name: 'John',
    last_name: 'Teacher',
    role: 'teacher',
  },
  {
    email: 'student@school.edu',
    password: 'demo123',
    first_name: 'Jane',
    last_name: 'Student',
    role: 'student',
  },
  {
    email: 'parent@school.edu',
    password: 'demo123',
    first_name: 'Mark',
    last_name: 'Parent',
    role: 'parent',
  },
];

async function seedDemoUsers() {
  let connection;

  try {
    console.log('🌱 Seeding demo users...\n');

    connection = await pool.getConnection();

    for (const user of DEMO_USERS) {
      try {
        // Check if user already exists
        const [existing] = await connection.query(
          'SELECT id FROM users WHERE email = ?',
          [user.email]
        );

        if (existing.length > 0) {
          console.log(`⏭️  Skipped ${user.email} (already exists)`);
          continue;
        }

        // Hash password
        const hashedPassword = await hashPassword(user.password);

        // Insert user
        await connection.query(
          'INSERT INTO users (email, password, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?)',
          [user.email, hashedPassword, user.first_name, user.last_name, user.role, 'active']
        );

        console.log(`✅ Created ${user.role.toUpperCase()}: ${user.email}`);
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }

    connection.release();

    console.log('\n✨ Demo users seeded successfully!\n');
    console.log('Login Credentials:');
    console.log('─'.repeat(50));
    DEMO_USERS.forEach(user => {
      console.log(`${user.role.padEnd(8)} | ${user.email.padEnd(25)} | ${user.password}`);
    });
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

seedDemoUsers();
