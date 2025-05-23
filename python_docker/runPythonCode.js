import fs from "fs";
import { exec } from "child_process";
function runPythonCode(code, slug) {
    console.log("Running Python code...");
    fs.writeFileSync(`a.py`, code.replace("```python", "").replace("```", ""));

    const process = exec(`manim_env/bin/python -m manim a.py MainScene -pqm -o MainVideo.mp4`);
    process.stdout.on('data', (data) => {
        console.log(data);
    });
    process.on('close', (code) => {
        console.log(`Python code exited with code ${code}`);
    });
    process.stderr.on('data', (data) => {
        console.error(data);
    });

}

export default runPythonCode;