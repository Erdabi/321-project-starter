const { executeSQL } = require('./database');

const initializeAPI = (app) => {

    // API-Endpunkt zum Abrufen aller Benutzer
  app.get("/api/users", async (req, res) => {
    try {
      const users = await executeSQL("SELECT * FROM users");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  });

  // API-Endpunkt zum Abrufen aller Nachrichten
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await executeSQL("SELECT * FROM messages");
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
    }
  });
};
module.exports = { initializeAPI };