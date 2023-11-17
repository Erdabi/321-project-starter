let username;
const messagesContainer = document.getElementById('messages');
const usersContainer = document.getElementById('users');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('send');
const socket = new WebSocket("ws://localhost:3000");

const requestUserList = () => {
  socket.send(JSON.stringify({ type: 'requestUsers' }));
};
socket.addEventListener('open', () => {
  requestUserList(); 
});


usernameInput.addEventListener('change', (event) => {
  username = event.target.value;
  messageInput.disabled = !username;
  if (username) {
  socket.send(JSON.stringify({ type: 'join', username }));
  }
});

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'userList') {
    displayUserList(data.users);
  } else if (data.type === 'message') {
    if (data.username !== username) {
      console.log("Granatapfel")
      displayMessage(data.username, data.message);
    }
  }
});

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
  if (!messageInput || !username) {
    alert('Please enter a username and a message.');
    return;
  }
  const message = messageInput.value;
  socket.send(JSON.stringify({ type: 'message', username, message }));
  displayMessage(username, message); 
  messageInput.value = '';
}

function displayMessage(user, message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = user + ": " + message;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function displayUserList(users) {
  usersContainer.innerHTML = '';
  users.forEach(user => {
    displayUser(user);
  });
}

function displayUser(user) {
  const userElement = document.createElement('div');
  userElement.textContent = user;
  usersContainer.appendChild(userElement);
}
window.onload = () => {
  fetchCurrentUsers();
  fetchCurrentMessages();
};

const fetchCurrentUsers = () => {
  fetch('/api/users')
    .then(response => response.json())
    .then(users => users.forEach(user => displayMessage(user.name)))
    .catch(error => console.error('Error fetching users:', error));
};

const fetchCurrentMessages = async () => {
  try {
    const usersResponse = await fetch('/api/users');
    const users = await usersResponse.json();
    const messagesResponse = await fetch('/api/messages');
    const messages = await messagesResponse.json();
    messages.forEach(message => {
      const user = users.find(user => user.id === message.user_id);
      if (user) {
        displayMessage(user.name, message.message);
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};
