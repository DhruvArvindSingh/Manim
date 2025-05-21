import { io } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to server");
});

export default socket;