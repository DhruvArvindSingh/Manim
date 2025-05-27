import { GoogleGenAI } from "@google/genai";
import sendResponse from "../kafka/index.js";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getGeminiRes(prompt, slug) {
    let codeBuffer = ""; // Buffer to accumulate code chunks
    let isCode = false;
    let chunkNo = 0;
    let finalResponse = "";
    let retryCount = 0;

    while (retryCount <= MAX_RETRIES) {
        try {
            console.log(`Attempt ${retryCount + 1} - LLM called with prompt: ${prompt}`);

            const result = await ai.models.generateContentStream({
                model: "gemini-2.0-flash",
                contents: `${prompt}`,
                config: {
                    temperature: 1.0,
                }
            });
            for await (const chunk of result) {
                const chunkText = chunk.text;
                if (chunkText == null || chunkText == "") continue;
                console.log("Received chunk: '", chunkText, "'");

                finalResponse += chunkText;

                // Function to handle code part extraction and sending
                const handleCodePart = async (text) => {
                    const cleanedCode = text
                        .replace("<code>", "")
                        .replace("</code>", "")
                    if (cleanedCode) {
                        await sendResponse(cleanedCode, slug, chunkNo++, true);
                    }
                };

                // Check for complete code blocks in a single chunk
                if (chunkText.includes("<code>") && chunkText.includes("</code>")) {
                    const parts = chunkText.split("<code>");
                    for (let part of parts) {
                        if (part.includes("</code>")) {
                            const [code, rest] = part.split("</code>");
                            await handleCodePart(code);
                            // if (rest.trim()) {
                            await sendResponse(rest, slug, chunkNo++, false);
                            // }
                        } else if (part) {
                            await sendResponse(part, slug, chunkNo++, false);
                        }
                    }
                    continue;
                }

                // Handle start of code block
                if (chunkText.includes("<code>")) {
                    isCode = true;
                    const [text, code] = chunkText.split("<code>");
                    if (text) {
                        await sendResponse(text, slug, chunkNo++, false);
                    }
                    codeBuffer = code || "";
                    continue;
                }

                // Handle end of code block
                if (chunkText.includes("</code>")) {
                    isCode = false;
                    const [code, text] = chunkText.split("</code>");
                    codeBuffer += code || "";
                    await handleCodePart(codeBuffer);
                    codeBuffer = ""; // Reset buffer
                    if (text) {
                        await sendResponse(text, slug, chunkNo++, false);
                    }
                    continue;
                }

                // Handle content within code block
                if (isCode) {
                    codeBuffer += chunkText;
                    continue;
                }

                // Handle regular text
                if (chunkText) {
                    await sendResponse(chunkText, slug, chunkNo++, false);
                }
            }

            // Handle any remaining code in buffer
            if (codeBuffer) {
                await handleCodePart(codeBuffer);
            }

            console.log("LLM_res: ", { "LLM_res": finalResponse });
            return finalResponse;

        } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);

            if (retryCount < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await sleep(delay);
                retryCount++;
                continue;
            }

            // If max retries reached, re-throw the error
            return null;
        }
    }
}

export default getGeminiRes;