const WebSocket = require("ws");
const { saveMessageToDB, addUserToDB, getUserByName } = require('./database');
const connectedUsers = new Map();
 
const initializeWebsocketServer = (server) => {
  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", (ws) => {
    ws.on("message", (message) => onMessage(ws, message, websocketServer));
    ws.on("close", () => onClose(ws, websocketServer));
  });
};


const onMessage = async (ws, message, websocketServer) => {
  const data = JSON.parse(message);
  if (data.type === 'join') {
    const user = await getUserByName(data.username);
  if (!user) {
    await addUserToDB(data.username);
  }
    connectedUsers.set(ws, data.username);
    broadcastUserList(websocketServer);
  } else if (data.type === 'message') {
    saveMessageToDB(data.username, data.message);
    broadcastMessage(websocketServer, data.username, data.message);
  }
};
 
const onClose = (ws, websocketServer) => {
  connectedUsers.delete(ws);
  broadcastUserList(websocketServer);
};
 
const broadcastUserList = (websocketServer) => {
  const userList = Array.from(connectedUsers.values());
  websocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ type: 'userList', users: userList }));
    }
  });
};
 
const broadcastMessage = (websocketServer, username, message) => {
  websocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'message', username, message
     }));
    }
  });
};
 
module.exports = { initializeWebsocketServer };