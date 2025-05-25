import { io } from "socket.io-client";
import getClaudeRes from "./utils/getClaudeRes.js";
import getPrompt from "./utils/getPrompt.js";
import runPythonCode from "./utils/runPythonCode.js";
import dotenv from "dotenv";
import solveErrorCode from "./utils/solveErrorCode.js";
import uploadToS3 from "./S3/index.js";
import deleteFiles from "./utils/deleteFiles.js";
import sendResponse from "./kafka/index.js";
import getSignedLink from "./utils/getSignedLink.js";
import getGeminiRes from "./utils/getGeminiRes.js";
dotenv.config();
let status = "idle";
// console.log("GEMINI_API_KEY", process.env.GEMINI_API_KEY);

const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:3001");
console.log("Listening to socket server at", process.env.SOCKET_SERVER_URL || "http://localhost:3001");

socket.on("rejoin_server", () => {
    // console.log("rejoin_server called");
    socket.emit("join_server", status);
})
socket.on("work", async ({ prompt, slug, rerun }) => {
    let noError = 0;
    console.log("work called");
    if (status == "idle") {
        status = "working";
        socket.emit("update_status", status);
        socket.emit("work_status", "accepted");
        sendResponse("Accepted", slug, -1, true);

        let res = await getClaudeRes(getPrompt(prompt, false, rerun), slug);
        if (res == null || res == '') {
            sendResponse("No response or tokens exhausted from Claude", slug, -1, true);
            res = await getGeminiRes(getPrompt(prompt, false, rerun), slug);
            console.log("res", res);
        }
        if (res == null || res == '') {
            res == null ? sendResponse("No response or tokens exhausted from Claude and Gemini", slug, -1, true) : sendResponse("No one gave any answer", slug, -1, true);
            status = "idle";
            socket.emit("update_status", status);
            return;
        }

        await sendResponse("Running code", slug, -1, true);

        let isError = await runPythonCode(res, slug);
        if (isError != null) {
            console.log("Error occured in 1st iteration");
            while (isError != null) {
                noError++;
                if (noError > 5) {
                    sendResponse("Too many errors, giving up", slug, -1, true);
                    status = "idle";
                    socket.emit("update_status", status);
                    return;
                }
                await sendResponse("Error in running code.. solving error", slug, -1, true);
                const code = await solveErrorCode(isError, slug);
                if (code == null) {
                    sendResponse("No response or tokens exhausted from LLM", slug, -1, true);
                    status = "idle";
                    socket.emit("update_status", status);
                    return;
                }
                // console.log("Code =", code);
                await deleteFiles();
                isError = await runPythonCode(code, slug);
                if (isError != null) {
                    console.log("Error occured in again");
                } else {
                    await sendResponse("Error solved", slug, -1, true);
                    break;
                }
            }


            console.log("Uploading to S3");
            await sendResponse("Uploading to cloud", slug, -1, true);
            await sendResponse(JSON.stringify({ "link": getSignedLink(slug) }), slug, -1, true);
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
            await sendResponse("Uploading to cloud", slug, -1, true);
            await sendResponse(JSON.stringify({ "link": getSignedLink(slug) }), slug, -1, true);
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