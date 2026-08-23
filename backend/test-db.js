const pool = require("./config/db");

async function testDatabase() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database test successful!");
    console.log("Server time:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();