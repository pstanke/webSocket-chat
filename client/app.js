const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
let userName = '';
const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

loginForm.addEventListener('submit', (e) => login(e));
addMessageForm.addEventListener('submit', (e) => sendMessage(e));

const login = (e) => {
  e.preventDefault();
  if (userNameInput.value.length == 0) {
    alert('Please type your login');
  } else {
    userName = userNameInput.value;
    socket.emit('join', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  if (author.includes('Chat Bot')) {
    message.classList.add('message--chatBot');
  }
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (messageContentInput.value.length == 0) {
    alert('Please type your message');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {
      author: userName,
      content: messageContentInput.value,
    });
    messageContentInput.value = '';
  }
};
