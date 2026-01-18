const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDB() {
  await pool.query(`SELECT 1`);
  console.log("Postgres connected");
}

module.exports = {
  pool,
  initDB,
};
