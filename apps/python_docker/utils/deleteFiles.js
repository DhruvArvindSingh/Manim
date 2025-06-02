import path from "path";
import { exec } from "child_process";

const __dirname = path.resolve();

async function deleteFiles() {
    const rmMedia = exec(`rm -rf ${__dirname}/media`);
    const rmPython = exec(`rm -rf ${__dirname}/a.py`);

    // Wait for both deletion processes to complete
    await Promise.all([
        new Promise(resolve => rmMedia.on('close', resolve)),
        new Promise(resolve => rmPython.on('close', resolve))
    ]);
}

export default deleteFiles;