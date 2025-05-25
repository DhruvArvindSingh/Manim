import getGeminiRes from "./getGeminiRes.js";
import getClaudeRes from "./getClaudeRes.js";
import getPrompt from "./getPrompt.js";

async function solveErrorCode(errorInfo, slug) {
    try {
        // Parse the error information
        const errorContext = JSON.parse(errorInfo);

        // Construct a detailed prompt for the LLM


        // Get the corrected code from the LLM
        // const correctedCode = await getClaudeRes(getPrompt(errorContext, true), slug);
        // if (correctedCode == null || correctedCode == '') {
        const correctedCode = await getGeminiRes(getPrompt(errorContext, true, false), slug);
        // }
        return correctedCode;
    } catch (err) {
        console.error("Error in solving code error:", err);
        throw err;
    }
}

export default solveErrorCode;