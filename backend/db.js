import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      name TEXT,
      height REAL,
      weight REAL,
      diseases TEXT,
      photo TEXT,
      position TEXT,
      workplace TEXT,
      approved BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      bread_units REAL,
      glucose REAL,
      dose REAL,
      interpretation TEXT,
      dose_approved BOOLEAN DEFAULT false,
      doctor_comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("✅ DB ready");
}

export default pool;
