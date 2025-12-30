// Helper para converter queries callback-based para async/await PostgreSQL
const db = require('./database');

// Wrapper para db.run (INSERT, UPDATE, DELETE)
async function dbRun(query, params = []) {
  const client = await db.connect();
  try {
    const result = await client.query(query, params);
    client.release();
    return result;
  } catch (error) {
    client.release();
    throw error;
  }
}

// Wrapper para db.get (SELECT single row)
async function dbGet(query, params = []) {
  const client = await db.connect();
  try {
    const result = await client.query(query, params);
    client.release();
    return result.rows[0] || null;
  } catch (error) {
    client.release();
    throw error;
  }
}

// Wrapper para db.all (SELECT multiple rows)
async function dbAll(query, params = []) {
  const client = await db.connect();
  try {
    const result = await client.query(query, params);
    client.release();
    return result.rows;
  } catch (error) {
    client.release();
    throw error;
  }
}

module.exports = { dbRun, dbGet, dbAll };
