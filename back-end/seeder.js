// database.js
const mysql = require('mysql2/promise');
const RESET_DB = true;

let pool; // 🔹 bewaren zodat hij maar één keer wordt aangemaakt

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateText = (numWords) => {
  const words = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(' ');
  return Array.from({ length: numWords }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
};

async function setupDatabase() {
  if (pool) return pool; // ✅ voorkom dubbele initialisatie

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'bit_academy',
    password: 'bit_academy',
  });

  await conn.query('CREATE DATABASE IF NOT EXISTS studytracker');
  await conn.end();

  pool = await mysql.createPool({
    host: 'localhost',
    user: 'bit_academy',
    password: 'bit_academy',
    database: 'studytracker',
    connectionLimit: 10,
    multipleStatements: true,
  });

  console.log('✅ Databasepool klaar voor gebruik');

  // Alleen bij reset: opschonen + seeden
  if (RESET_DB) {
    console.log('🧹 Database wordt gereset...');
    await pool.query(`
      SET FOREIGN_KEY_CHECKS=0;
      TRUNCATE TABLE IF EXISTS user_progress;
      TRUNCATE TABLE IF EXISTS lessons;
      TRUNCATE TABLE IF EXISTS chapters;
      TRUNCATE TABLE IF EXISTS courses;
      TRUNCATE TABLE IF EXISTS providers;
      TRUNCATE TABLE IF EXISTS users;
      SET FOREIGN_KEY_CHECKS=1;
    `);
    console.log('✅ Database leeggemaakt.');
    await seedDatabase(pool);
  } else {
    console.log('⚠️ RESET_DB = false, seeding overgeslagen.');
  }

  return pool;
}

// 🔹 Losse functie voor seeden
async function seedDatabase(db) {
  console.log('📚 Voeg voorbeelddata toe...');
  // ... (gebruik hier exact dezelfde seeding-code als je had)
}

module.exports = setupDatabase;
