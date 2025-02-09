function sendMessage(message) {
    var socket = require("socket.io-client")("http://localhost:8080/chat");
    
    socket.emit("message", message);

    // Wait 500ms before disconnecting
    java.lang.Thread.sleep(500);
    socket.disconnect();

    return { status: "Message sent" };
}
