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

async function getLLMres(prompt, slug, isError) {
    let chunkNo = 0;
    let isCode = false;
    let finalResponse = "";
    console.log("LLM called with prompt: ", prompt);

    try {
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
                await sendResponse(chunk.delta.text, slug, chunkNo++, false);
                finalResponse += chunk.delta.text;
            }
        }

        // Claude returns the complete response at once, not in chunks
        console.log("LLM_res: ", { "LLM_res": finalResponse });

        return finalResponse;
    } catch (error) {
        console.error("Error in LLM response:", error);
        throw error;
    }
}

export default getLLMres;