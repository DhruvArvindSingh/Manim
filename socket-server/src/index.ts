import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const io = new Server(parseInt(process.env.SOCKET_SERVER_PORT || "3001"));

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("llm_response", (data) => {
        console.log(data);
    });
});