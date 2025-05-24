import { io } from "socket.io-client";
import getLLMres from "./utils/getLLMres.js";
import runPythonCode from "./utils/runPythonCode.js";
import dotenv from "dotenv";
import solveErrorCode from "./utils/solveErrorCode.js";
import uploadToS3 from "./S3/index.js";
import deleteFiles from "./utils/deleteFiles.js";
import sendResponse from "./kafka/index.js";

dotenv.config();
let status = "idle";
// console.log("GEMINI_API_KEY", process.env.GEMINI_API_KEY);

const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:3001");
console.log("Listening to socket server at", process.env.SOCKET_SERVER_URL || "http://localhost:3001");

socket.on("rejoin_server", () => {
    // console.log("rejoin_server called");
    socket.emit("join_server", status);
})
socket.on("work", async ({ prompt, slug }) => {
    console.log("work called");
    if (status == "idle") {
        status = "working";
        socket.emit("update_status", status);
        socket.emit("work_status", "accepted");

        const res = await getLLMres(prompt, slug);

        // await sendResponse("Running code", slug, -1, true);

        let isError = await runPythonCode(res, slug);
        if (isError != null) {
            console.log("Error occured in 1st iteration");
            // await sendResponse("Error in running code.. solving error", slug, -1, true);
            while (isError != null) {
                console.log("Error occured once again");
                const code = await solveErrorCode(isError, slug);
                // console.log("Code =", code);
                await deleteFiles();
                isError = await runPythonCode(code, slug);
                (isError) ? console.log("Error occured in again") : console.log("Error solved");
            }
            console.log("Uploading to S3");
            const ress = await uploadToS3(slug);
            console.log("Uploaded to S3");
            await sendResponse("Broadcasting video", slug, -1, true);
            await deleteFiles();
            await sendResponse("Work completed", slug, -1, true);
        }
        else {
            console.log(`Python code execution completed`);

            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Uploading to S3");
            const res = await uploadToS3(slug);
            console.log("Uploaded to S3");
            await sendResponse("Broadcasting video", slug, -1, true);
            await deleteFiles();
            await sendResponse("Work completed", slug, -1, true);
        }
        status = "idle";
        socket.emit("update_status", status);
    }
    else {
        console.log("Already working on another task");
        socket.emit("work_status", "error");
    }
})

export default socket;