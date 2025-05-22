import { Server } from "socket.io";
import dotenv from "dotenv";
import consumer from "./kafka/index.js";

initKafkaConsumer();
dotenv.config();

const io = new Server(parseInt(process.env.SOCKET_SERVER_PORT || "3002"));

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

async function initKafkaConsumer() {
    console.log("Initializing Kafka consumer...");
    await consumer.connect()
    await consumer.subscribe({ topic: 'llm-response' })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            // @ts-ignore
            const slug: string = await message.key!.toString();
            console.log("\n\nmessage slug =", slug);
            const { response, chunkNo } = JSON.parse(message.value?.toString() || "{}");
            console.log("response =", response);
            console.log("chunkNo =", chunkNo, "\n");
            io.to(slug).emit("llm_response", { response, chunkNo });
        },
    })
}