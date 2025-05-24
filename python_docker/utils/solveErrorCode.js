import getLLMres from "./getLLMres.js";
import getPrompt from "./getPrompt.js";

async function solveErrorCode(errorInfo, slug) {
    try {
        // Parse the error information
        const errorContext = JSON.parse(errorInfo);

        // Construct a detailed prompt for the LLM


        // Get the corrected code from the LLM
        const correctedCode = await getLLMres(getPrompt(errorContext, true), slug);
        return correctedCode;
    } catch (err) {
        console.error("Error in solving code error:", err);
        throw err;
    }
}

export default solveErrorCode;