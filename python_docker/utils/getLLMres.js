import { GoogleGenAI } from "@google/genai";
import sendResponse from "../kafka/index.js";
import getPrompt from "./getPrompt.js";
import Anthropic from '@anthropic-ai/sdk';
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const anthropic = new Anthropic({
    apiKey: `${process.env.CLAUDE_API_KEY}`, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLLMres(prompt, slug, isError) {
    let chunkNo = 0;
    let isCode = false;
    let finalResponse = "";
    let retryCount = 0;

    while (retryCount <= MAX_RETRIES) {
        try {
            console.log(`Attempt ${retryCount + 1} - LLM called with prompt: ${prompt}`);

            const msg = await anthropic.messages.stream({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 4096,
                stream: true,
                temperature: 1,
                messages: [{
                    role: "user",
                    content: getPrompt(prompt, isError),
                }],
            });

            for await (const chunk of msg) {
                if (chunk.type === "content_block_delta" && chunk.delta?.text && (chunk.delta?.text.includes("<code>") || isCode)) {
                    // console.log(chunk.delta.text);
                    if (chunk.delta.text.includes("</code>")) {
                        isCode = false;
                        chunk.delta.text = chunk.delta.text.split("</code>")[0];
                    }
                    if (chunk.delta.text.includes("<code>")) {
                        isCode = true;
                        chunk.delta.text = chunk.delta.text.split("<code>")[1];
                    }
                    console.log(chunk.delta.text);
                    await sendResponse(chunk.delta.text.replace("<code>", "").replace("</code>", ""), slug, chunkNo++, false);
                    finalResponse += chunk.delta.text.replace("<code>", "").replace("</code>", "");
                }
            }

            // Claude returns the complete response at once, not in chunks
            console.log("LLM_res: ", { "LLM_res": finalResponse });

            return finalResponse;
        } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);

            if (error?.error?.error?.type === 'overloaded_error' && retryCount < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await sleep(delay);
                retryCount++;
                continue;
            }

            // If we've exhausted retries or it's a different error, throw it
            throw error;
        }
    }
}

export default getLLMres;