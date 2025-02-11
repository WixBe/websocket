// const express = require("express");
import express from "express";
// const mongoose = require("mongoose");
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/socket-messages", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a schema and model
const MessageSchema = new mongoose.Schema({
    message: String,
    senderId: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", MessageSchema);

// Store messages
app.post("/messages", async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
});

// Retrieve all messages
app.get("/messages", async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

// Start the server
app.listen(5000, () => console.log("Storage API running on http://localhost:5000"));
