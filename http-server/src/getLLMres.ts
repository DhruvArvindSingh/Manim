import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import socket from "./socket.js";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getLLMres(prompt: string) {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: `
You are a great software engineer that can create videos using manim python library.
You need to create a single python file which uses manim python library to create a video which has a main class with a method called main which when run create the whole video which satisfies the prompt given by the user.

Your code will be saved directly to a file called 'a.py' in the root folder, so make sure it's a complete, runnable script.

Include the main execution section at the end of your script like this:

if name == "main":
    with tempconfig(
        {
            "quality": "medium_quality",
            "frame_rate": 30,
            "preview": True,
        }
    ):
        scene = YourSceneClassName()
        scene.construct()

Send the python code in such a manner that when it is pasted in a python file, it runs without any errors and indentations are correct.
        Do not use any external libraries other than manim.
    Do not use any external assets like images, audio, etc. Use only manim shapes to replace assets.
    Do not use any external functions other than the ones provided by manim.
    Make sure that 2 objects are not overlapping each other while writing the code.

    The code will be run on Ubuntu using Python 3 inside a virtual environment.
    To run the animation, you'll need to:
    1. Activate the virtual environment: source manim_env/bin/activate
    2. Run the command: python -m manim a.py YourSceneClassName -pqm

    Alternatively, you can run it directly using the python interpreter from the virtual environment:
    manim_env/bin/python -m manim a.py YourSceneClassName -pqm

    The prompt is as given below in '\"':
    \"${prompt}\"
        `,
        config: {
            temperature: 1,
        },
    });
    for await (const chunk of response) {
        socket.emit("llm_response", chunk.text);
        console.log(chunk.text);
    }
}

export default getLLMres;