// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', ws => {
//     console.log('Client connected');

//     ws.on('message', message => {
//         console.log(`Received message: ${message}`);

//         ws.send(`Server recieved: ${message}`)

//         wss.clients.forEach(client => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(`Broadcast: ${message}`);
//             }
//         });
//     });

//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });

//     ws.on('error', error => {
//         console.error(`WebSocket error: ${error}`);
//     });

//     ws.send('Welcome to the WebSocket server!');
// });

// console.log('WebSocket server started on ws://localhost:8080');

const { Server } = require("socket.io");

const io = new Server(8080, {
    cors: { origin: "*" }
});

console.log("Socket.IO server started on ws://localhost:8080");

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Emit a welcome message
    socket.emit("welcome", "Welcome to the Socket.IO server!");

    // Listen for messages
    socket.on("message", (message) => {
        console.log(`Received message from ${socket.id}: ${message}`);

        // Send back to sender
        socket.emit("server_message", `Server received: ${message}`);

        // Broadcast to all clients with sender's ID
        socket.broadcast.emit("broadcast", {
            message: `Broadcast: ${message}`,
            senderId: socket.id
        });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });

    socket.on("error", (error) => {
        console.error(`WebSocket error: ${error}`);
    });
});


//

// const { Server } = require("socket.io");

// const io = new Server(8080, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         credentials: true
//     },
//     transports: ['websocket', 'polling'],
//     pingInterval: 10000,
//     pingTimeout: 5000,
//     allowEIO3: true
// });

// // Store connected clients for debugging
// const connectedClients = new Map();

// io.on("connection", (socket) => {
//     console.log(`New client connected - ID: ${socket.id}`);
//     console.log('Client handshake:', socket.handshake.query);
    
//     // Store client info
//     connectedClients.set(socket.id, {
//         connectionTime: new Date(),
//         lastMessage: null,
//         messageCount: 0
//     });

//     // Welcome message with acknowledgment
//     socket.emit("message", "Welcome to the Socket.IO server!", (ack) => {
//         console.log(`Welcome message ${ack ? 'acknowledged' : 'not acknowledged'} by ${socket.id}`);
//     });

//     // Handle incoming messages
//     socket.on("message", (data, callback) => {
//         const clientInfo = connectedClients.get(socket.id);
//         if (clientInfo) {
//             clientInfo.lastMessage = new Date();
//             clientInfo.messageCount++;
//         }

//         console.log(`Received message from ${socket.id}:`, data);
        
//         // Echo back to sender
//         socket.emit("message", `Server received: ${data}`, (ack) => {
//             console.log(`Message echo ${ack ? 'acknowledged' : 'not acknowledged'} by ${socket.id}`);
//         });

//         // Broadcast to others
//         socket.broadcast.emit("message", `Broadcast: ${data}`);

//         // If callback exists, acknowledge receipt
//         if (typeof callback === 'function') {
//             callback({ status: 'received' });
//         }
//     });

//     // Handle client pings
//     socket.on("ping", () => {
//         console.log(`Ping received from ${socket.id}`);
//         socket.emit("pong");
//     });

//     // Monitor disconnections
//     socket.on("disconnect", (reason) => {
//         console.log(`Client disconnected - ID: ${socket.id}, Reason: ${reason}`);
//         console.log('Client stats:', connectedClients.get(socket.id));
//         connectedClients.delete(socket.id);
//     });

//     // Handle errors
//     socket.on("error", (error) => {
//         console.error(`Error from ${socket.id}:`, error);
//     });
// });

// // Monitor all Socket.IO events
// io.engine.on("connection_error", (err) => {
//     console.error("Connection error:", {
//         code: err.code,
//         message: err.message,
//         context: err.context
//     });
// });

// // Print server status every 30 seconds
// setInterval(() => {
//     console.log('\nServer Status:');
//     console.log('Connected clients:', connectedClients.size);
//     connectedClients.forEach((info, id) => {
//         console.log(`Client ${id}:`, {
//             connectedFor: `${Math.round((new Date() - info.connectionTime)/1000)}s`,
//             messageCount: info.messageCount,
//             lastMessageAt: info.lastMessage
//         });
//     });
// }, 30000);

// console.log("Socket.IO server started on port 8080");