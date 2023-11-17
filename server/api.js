const { executeSQL } = require('./database');

const initializeAPI = (app) => {


  app.get("/api/users", async (req, res) => {
    try {
      const users = await executeSQL("SELECT * FROM users");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await executeSQL(
        "SELECT messages.*, users.name as username FROM messages JOIN users ON messages.user_id = users.id");
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error });
    }
  });
}

module.exports = { initializeAPI };