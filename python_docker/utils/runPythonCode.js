import fs from "fs";
import { exec } from "child_process";
import path from "path";

const __dirname = path.resolve();

async function runPythonCode(code, slug) {
    let errorMessages = [];
    let stdoutMessages = [];

    try {
        fs.writeFileSync(`a.py`, code.replace("```python", "").replace("```", ""));

        const process = exec(`manim_env/bin/python -m manim a.py MainScene -pqm -o MainVideo.mp4`);

        process.stdout.on('data', (data) => {
            console.log(data);
            stdoutMessages.push(data);
        });

        process.stderr.on('data', (data) => {
            console.log(data);
            errorMessages.push(data);
        });

        // Convert event-based process completion to async/await
        await new Promise((resolve, reject) => {
            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    // Provide detailed error context
                    const errorContext = {
                        exitCode: code,
                        stderr: errorMessages.join('\n'),
                        stdout: stdoutMessages.join('\n'),
                        pythonCode: code
                    };
                    reject(errorContext);
                }
            });
            process.on('error', (err) => {
                reject({
                    processError: err.message,
                    stderr: errorMessages.join('\n'),
                    stdout: stdoutMessages.join('\n'),
                    pythonCode: code
                });
            });
        });
        return null;
    } catch (err) {
        console.log("Error in running Python code:", err.exitCode || 'Process Error');
        // Return comprehensive error information
        return JSON.stringify({
            error: err.processError || `Process exited with code ${err.exitCode}`,
            stderr: err.stderr || errorMessages.join('\n'),
            stdout: err.stdout || stdoutMessages.join('\n'),
            pythonCode: code
        });
    }
}

export default runPythonCode;
