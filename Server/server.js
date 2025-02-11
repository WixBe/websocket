// const { Server } = require("socket.io");
import { Server } from "socket.io";
// const axios = require("axios");
import axios from "axios";

const io = new Server(8080, {
    cors: { origin: "*" },
    methods: ['GET', 'POST']
});

console.log("Socket.IO server started on ws://localhost:8080");

io.of('/chat').on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Emit a welcome message
    socket.emit("welcome", "Welcome to the Socket.IO server!");

    // Listen for messages
    socket.on("message", async (message) => {
        console.log(`Received message from ${socket.id}: ${message}`);

        // Store message in storage API
        await axios.post("http://localhost:5000/messages", {
            message,
            senderId: socket.id
        });

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
