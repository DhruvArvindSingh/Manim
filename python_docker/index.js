import { io } from "socket.io-client";
import getLLMres from "./getLLMres.js";
import runPythonCode from "./runPythonCode.js";
import dotenv from "dotenv";
import sendResponse from "./kafka/index.js";

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
        const res = await getLLMres(prompt, slug);
        console.log("LLM response =", res);
        await sendResponse("Running code", slug, -1, true);
        await runPythonCode(res, slug);
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