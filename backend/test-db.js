require("dotenv").config();

const pool = require("./config/db");

async function testDatabase() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database test successful!");
    console.log("Server time:", result.rows[0].now);

    await pool.end();
  } catch (error) {
    console.error("Database test failed:", error.message);
  }
}

testDatabase();