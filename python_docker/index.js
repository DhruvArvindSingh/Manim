import { io } from "socket.io-client";
import getLLMres from "./getLLMres.js";
import runPythonCode from "./runPythonCode.js";
import dotenv from "dotenv";
dotenv.config();
let status = "idle";
console.log("GEMINI_API_KEY", process.env.GEMINI_API_KEY);

const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:3001");
console.log("Listening to socket server at", process.env.SOCKET_SERVER_URL || "http://localhost:3001");

socket.on("rejoin_server", () => {
    console.log("rejoin_server called");
    socket.emit("join_server", status);
})
socket.on("work", async ({ prompt, slug }) => {
    console.log("work called with prompt =", prompt, "and slug =", slug);
    if (status == "idle") {
        status = "working";
        socket.emit("update_status", status);
        socket.emit("work_status", "accepted");
        const response = await getLLMres(prompt, slug);
        await runPythonCode(response, slug);
        console.log("Work completed");
        status = "idle";
        socket.emit("update_status", status);
    }
    else {
        console.log("Already working on another task");
        socket.emit("work_status", "error");
    }
})

export default socket;