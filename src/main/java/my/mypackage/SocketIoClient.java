package my.mypackage;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

import java.net.URISyntaxException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class SocketIoClient {

    private Socket socket;

    public SocketIoClient(String url) throws URISyntaxException {
        // Connect to the provided URL (e.g., "http://localhost:8080/chat")
        socket = IO.socket(url);
    }

    public String sendMessage(String message) throws InterruptedException {
        final CountDownLatch latch = new CountDownLatch(1);
        final StringBuilder response = new StringBuilder();

        // When connected, send the message
        socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                System.out.println("Socket connected, sending message: " + message);
                socket.emit("message", message);
            }
        });

        // Listen for the server's response (adjust event name if needed)
        socket.on("server_message", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                if (args.length > 0) {
                    response.append(args[0].toString());
                    latch.countDown();
                }
            }
        });

        socket.connect();
        // Wait up to 5 seconds for the response
        latch.await(5, TimeUnit.SECONDS);
        socket.disconnect();
        return response.toString();
    }
}
