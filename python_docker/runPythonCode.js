import fs from "fs";
import { exec } from "child_process";
import uploadToS3 from "./S3/index.js";
import path from "path";

const __dirname = path.resolve();

async function runPythonCode(code, slug) {
    console.log("Running Python code...");
    try {
        fs.writeFileSync(`a.py`, code.replace("```python", "").replace("```", ""));
    }
    catch (err) {
        console.error("Error writing file:", err);
    }
    try {
        const process = exec(`manim_env/bin/python -m manim a.py MainScene -pqm -o MainVideo.mp4`);
        process.stdout.on('data', (data) => {
            console.log(data);
        });
        process.on('close', async (code) => {
            console.log(`Python code exited with code ${code}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await uploadToS3(slug);
            console.log("Uploaded to S3");
            deleteFiles();
            return res;
        });
        process.stderr.on('data', (data) => {
            console.error(data);
        });
        return;
    } catch (err) {
        console.error("Error running Python code:", err);
    }


}

export default runPythonCode;

function deleteFiles() {
    try {
        const p = exec(`rm -rf ${__dirname}/media`);
        const q = exec(`rm -rf ${__dirname}/a.py`);

        return;
    } catch (err) {
        console.error("Error deleting files:", err);
    }
}
