import { io } from "socket.io-client";
import getLLMres from "./getLLMres.js";
import dotenv from "dotenv";
dotenv.config();
let status = "idle";
console.log("GEMINI_API_KEY", process.env.GEMINI_API_KEY);

const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:3001");
console.log("Listening to socket server at", process.env.SOCKET_SERVER_URL || "http://localhost:3001");

socket.emit("join_server", status);
socket.on("work", async (prompt) => {
    status == "idle" ? status = "working" : status = "idle";
    socket.emit("update_status", status);
    await getLLMres(prompt);
    console.log("Work completed");
    status = "idle";
    socket.emit("update_status", status);
})

export default socket;