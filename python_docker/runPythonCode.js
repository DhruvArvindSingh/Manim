import fs from "fs";
import { exec } from "child_process";
import uploadToS3 from "./S3/index.js";
import path from "path";
import sendResponse from "./kafka/index.js";

const __dirname = path.resolve();

async function runPythonCode(code, slug) {
    console.log("Running Python code...");

    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(`a.py`, code.replace("```python", "").replace("```", ""));

            const process = exec(`manim_env/bin/python -m manim a.py MainScene -pqm -o MainVideo.mp4`);

            process.stdout.on('data', (data) => {
                console.log(data);
            });

            process.stderr.on('data', (data) => {
                console.error(data);
            });

            process.on('close', async (code) => {
                console.log(`Python code exited with code ${code}`);
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const res = await uploadToS3(slug);
                    console.log("Uploaded to S3");
                    await sendResponse("Broadcasting video", slug, -1, true);
                    await deleteFiles();
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });

        } catch (err) {
            reject(err);
        }
    });
}

export default runPythonCode;

async function deleteFiles() {
    return new Promise((resolve, reject) => {
        try {
            const p = exec(`rm -rf ${__dirname}/media`);
            const q = exec(`rm -rf ${__dirname}/a.py`);

            // Wait for both commands to complete
            Promise.all([
                new Promise(r => p.on('close', r)),
                new Promise(r => q.on('close', r))
            ]).then(() => resolve());
        } catch (err) {
            reject(err);
        }
    });
}
