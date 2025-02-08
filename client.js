// DOM elements
const urlInput = document.getElementById('urlInput');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const statusDiv = document.getElementById('status');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const clearButton = document.getElementById('clearButton');
const messagesDiv = document.getElementById('messages');

let socket = null;

// Helper function to add messages to the UI
function addMessage(message, type, messageType = '', senderId = '') {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    if (messageType) {
        const typeDiv = document.createElement('div');
        typeDiv.className = 'message-type';

        const typeSpan = document.createElement('span');
        typeSpan.textContent = messageType;
        typeDiv.appendChild(typeSpan);

        if (senderId) {
            const idSpan = document.createElement('span');
            idSpan.className = 'sender-id';
            idSpan.textContent = `from: ${senderId}`;
            typeDiv.appendChild(idSpan);
        }

        messageElement.appendChild(typeDiv);
    }

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = new Date().toLocaleTimeString();

    const content = document.createElement('div');
    content.textContent = message;

    messageElement.appendChild(timestamp);
    messageElement.appendChild(content);

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setupSocket(url) {
    // Clean up existing socket if any
    if (socket) {
        socket.disconnect();
    }

    // Create new socket connection
    socket = io(url, {
        transports: ['websocket', 'polling']
    });

    // Connection event handlers
    socket.on('connect', () => {
        statusDiv.textContent = `Connected (ID: ${socket.id})`;
        statusDiv.className = 'connection-status connected';
        messageInput.disabled = false;
        sendButton.disabled = false;
        connectButton.disabled = true;
        disconnectButton.disabled = false;
        urlInput.disabled = true;
    });

    socket.on('disconnect', () => {
        statusDiv.textContent = 'Disconnected';
        statusDiv.className = 'connection-status disconnected';
        messageInput.disabled = true;
        sendButton.disabled = true;
        connectButton.disabled = false;
        disconnectButton.disabled = true;
        urlInput.disabled = false;
    });

    // Welcome message handler
    socket.on('welcome', (message) => {
        addMessage(message, 'welcome', 'WELCOME MESSAGE');
    });

    // Server response handler
    socket.on('server_message', (message) => {
        addMessage(message, 'received', 'SERVER RESPONSE');
    });

    // Broadcast handlerA
    socket.on('broadcast', (data) => {
        addMessage(data.message, 'broadcast', 'BROADCAST', data.senderId);
    });

    // Error handling
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        addMessage(`Connection error: ${error.message}`, 'error', 'ERROR');
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
        addMessage(`Socket error: ${error.message}`, 'error', 'ERROR');
    });
}

// Send message function
function sendMessage() {
    const message = messageInput.value.trim();
    if (message && socket && socket.connected) {
        socket.emit('message', message, (response) => {
            console.log('Message acknowledged:', response);
        });
        addMessage(message, 'sent', 'SENT');
        messageInput.value = '';
    }
}

// UI event handlers
connectButton.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
        setupSocket(url);
    }
});

disconnectButton.addEventListener('click', () => {
    if (socket) {
        socket.disconnect();
    }
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

clearButton.addEventListener('click', () => {
    messagesDiv.innerHTML = '';
});