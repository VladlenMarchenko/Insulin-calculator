// db.js
const { Pool } = require("pg");
require("dotenv").config(); // загружаем .env, если он есть

// Берем DATABASE_URL из окружения
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL не задана! Проверьте .env или переменные окружения.");
  process.exit(1);
}

// Настройки SSL: отключаем проверку на проде, если требуется
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Функция для проверки подключения
async function initDB() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Postgres connected");
  } catch (err) {
    console.error("❌ Ошибка подключения к Postgres:", err);
    process.exit(1); // останавливаем сервер, если БД не доступна
  }
}

module.exports = {
  pool,
  initDB,
};
