import { Server } from "socket.io";
import dotenv from "dotenv";
import consumer from "./kafka/index.js";

dotenv.config();

// Initialize Kafka consumer first, then start Socket.IO server
async function main() {
    try {
        // Initialize Kafka consumer
        console.log("Initializing Kafka consumer...");
        await consumer.connect();
        console.log("Kafka consumer connected successfully");

        await consumer.subscribe({ topic: 'llm-response' });

        // Only start Socket.IO server after Kafka is connected
        const io = new Server(parseInt(process.env.SOCKET_SERVER_PORT || "3002"), {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        console.log(`Socket.IO server started on port ${process.env.SOCKET_SERVER_PORT || "3002"}`);

        console.log(`Socket.IO server started on port ${process.env.SOCKET_SERVER_PORT || "3002"}`);

        io.on("connection", (socket) => {
            console.log("a user connected");
            socket.on("llm_response", (data) => {
                console.log(data);
            });
            socket.on("join_room", (data: string) => {
                const { slug } = JSON.parse(data);
                console.log("joining room", slug);
                socket.join(slug);
            });
        });

        // Start Kafka consumer processing
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // @ts-ignore
                const slug: string = await message.key!.toString();
                console.log("Received message from Kafka", slug, message.value?.toString());

                const payload = JSON.parse(message.value?.toString() || "{}");
                if (payload.isStatus) {
                    io.to(slug).emit("project_status", { response: payload.response });
                }
                else {
                    io.to(slug).emit("llm_response", { response: payload.response, chunkNo: payload.chunkNo });
                }
            },
        });
    } catch (error) {
        console.error("Failed to initialize services:", error);
        process.exit(1);
    }
}

// Start the application
main().catch(error => {
    console.error("Unhandled error:", error);
    process.exit(1);
});