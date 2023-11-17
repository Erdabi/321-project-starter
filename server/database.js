let pool = null;
 
const initializeMariaDB = () => {
  const mariadb = require("mariadb");
  pool = mariadb.createPool({
    database: process.env.DB_NAME || "mychat",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "mychat",
    password: process.env.DB_PASSWORD || "mychatpassword",
    connectionLimit: 5,
  });
};
 
const executeSQL = async (query) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(query);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};
 
const initializeDBSchema = async () => {
  const userTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  );`;
  await executeSQL(userTableQuery);
  const messageTableQuery = `CREATE TABLE IF NOT EXISTS messages (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;
  await executeSQL(messageTableQuery);
};
 
 
const saveMessageToDB = async (username, message) => {
  const userId = await addUserToDB(username);
  const insertMessageQuery = `INSERT INTO messages (user_id, message) VALUES (${userId}, '${message}')`;
  await executeSQL(insertMessageQuery);
};
 
const addUserToDB = async (username) => {
  const addUserQuery = `INSERT INTO users (name) VALUES ('${username}')`;
  const result = await executeSQL(addUserQuery);
  return result.insertId;
};
 
module.exports = { executeSQL, initializeMariaDB, initializeDBSchema, saveMessageToDB, addUserToDB };
 
 