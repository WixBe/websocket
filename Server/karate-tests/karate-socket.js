function sendMessage(request) {
    const io = require('socket.io-client');
    const socket = io('http://localhost:8080/chat');

    socket.emit('message', request.message);

    // Promise to handle the asynchronous socket operation
    return new Promise((resolve, reject) => {
        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            resolve({ status: 'Message sent' });
        });

        socket.on('error', (err) => {
            reject(err);
        });
    });
}
