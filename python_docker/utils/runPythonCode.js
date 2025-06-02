import fs from "fs";
import { exec } from "child_process";
import path from "path";

const __dirname = path.resolve();

async function runPythonCode(code, slug) {
    let errorMessages = [];
    let stdoutMessages = [];

    try {
        // Clean up the code by removing markdown and HTML tags
        const cleanedCode = code
            .replace(/```python/g, "")
            .replace(/```/g, "")
            .replace(/<code>/g, "")
            .replace(/<\/code>/g, "")
            .trim();

        // Write the cleaned code to a file
        console.log("Writing Python code to a.py");
        fs.writeFileSync(`a.py`, cleanedCode);

        // Log the Python version for debugging
        console.log("Checking Python version...");
        await new Promise((resolve) => {
            const versionCheck = exec('python --version');
            versionCheck.stdout.on('data', (data) => console.log("Python version:", data.trim()));
            versionCheck.stderr.on('data', (data) => console.log("Python version error:", data.trim()));
            versionCheck.on('close', resolve);
        });

        // Log if Manim is installed
        console.log("Checking Manim installation...");
        await new Promise((resolve) => {
            const manimCheck = exec('python -c "import manim; print(f\'Manim version: {manim.__version__}\')"');
            manimCheck.stdout.on('data', (data) => console.log(data.trim()));
            manimCheck.stderr.on('data', (data) => console.log("Manim check error:", data.trim()));
            manimCheck.on('close', resolve);
        });

        // The -p flag in manim opens the video after rendering; remove it to prevent auto-opening.
        console.log("Running Manim with command: python -m manim a.py MainScene -qm -o MainVideo.mp4");
        let process;

        try {
            // Try the system Python first
            process = exec(`python -m manim a.py MainScene -qm -o MainVideo.mp4`);
            // process = exec(`manim_env/bin/python -m manim a.py MainScene -qm -o MainVideo.mp4`);
        } catch (error) {
            console.log("Failed to run with system Python, trying fallback paths:", error);

            // Try fallback paths if system Python fails
            const fallbackPaths = [
                "python3 -m manim a.py MainScene -qm -o MainVideo.mp4",
                "/usr/bin/python3 -m manim a.py MainScene -qm -o MainVideo.mp4",
                "/usr/local/bin/python -m manim a.py MainScene -qm -o MainVideo.mp4",
                "manim_env/bin/python -m manim a.py MainScene -qm -o MainVideo.mp4"
            ];

            for (const cmd of fallbackPaths) {
                try {
                    console.log(`Trying fallback command: ${cmd}`);
                    process = exec(cmd);
                    console.log("Fallback command started successfully");
                    break; // Break the loop if successful
                } catch (e) {
                    console.log(`Fallback command ${cmd} failed:`, e);
                    // Continue to the next fallback
                }
            }

            if (!process) {
                throw new Error("All Python execution attempts failed");
            }
        }

        process.stdout.on('data', (data) => {
            console.log("Manim stdout:", data);
            stdoutMessages.push(data);
        });

        process.stderr.on('data', (data) => {
            console.log("Manim stderr:", data);
            errorMessages.push(data);
        });

        // Convert event-based process completion to async/await
        await new Promise((resolve, reject) => {
            process.on('close', (code) => {
                console.log(`Manim process exited with code ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    // Provide detailed error context
                    const errorContext = {
                        exitCode: code,
                        stderr: errorMessages.join('\n'),
                        stdout: stdoutMessages.join('\n'),
                        pythonCode: cleanedCode
                    };
                    reject(errorContext);
                }
            });
            process.on('error', (err) => {
                console.log("Error in running Python code:", err.message);
                reject({
                    processError: err.message,
                    stderr: errorMessages.join('\n'),
                    stdout: stdoutMessages.join('\n'),
                    pythonCode: cleanedCode
                });
            });
        });

        console.log("Manim execution completed successfully");
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
