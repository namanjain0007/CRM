require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Required for Render external DB connection
  },
});

pool
  .connect()
  .then(() => console.log("PostgreSQL connected!")) // Replace with your preferred logging method
  .catch((err) => console.error("Connection error", err.stack)); // Replace with your preferred logging method

module.exports = pool;
