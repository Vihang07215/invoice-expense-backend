const { Pool } = require("pg");
require("dotenv").config();

// Create a new pool using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Function to query database
const query = (text, params) => pool.query(text, params);

// Export both pool and query function
module.exports = {
  pool,
  query,
};
