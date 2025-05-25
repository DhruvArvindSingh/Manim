function getPrompt(Prompt, isError, rerun = false) {
    if (rerun) {
        console.log("rerun is true");
        const { prompt, code } = JSON.parse(Prompt);
        console.log("prompt", prompt, "code", code);
        return `
        You are a great software engineer that can create videos using manim python library.
        You need to create a single python file which uses manim python library to create a video which has a main class called "MainScene" which when run create the whole video which satisfies the prompt and code given by the user.
        Make changes to the code provided by the useras per the prompt the user.
        Your code will be saved directly to a file called 'a.py ' in the root folder, so make sure it's a complete, runnable script.
        Do not use external svg files.

        Please respond with only the corrected code in a code block, no explanations needed.
Dont add "Here's the corrected version of the code that addresses the syntax error and maintains all the original functionality:" at the beginning of the code.
Just return the python code.
Put the code in a <code> tag and end the code with </code> tag.
        
        Include the main execution section at the end of your script like this:
        if name == "main":
            with tempconfig(
                {
                    "quality": "medium_quality",
                    "frame_rate": 30,
                    "preview": True,
                }
            ):
                scene = MainScene()
                scene.construct()
        
        The code provided by the user is below in '\"':
        \"${code}\"

        The user provided prompt is below in '\"':
        \"${prompt}\"
        
        `

    }
    if (isError) {
        return `
        I need help fixing a Python code that's generating an error in a Manim animation.

Original Code:
\`\`\`python
${Prompt.pythonCode}
\`\`\`

Error Message:
${Prompt.stderr}

Additional Context:
- Exit Code: ${Prompt.exitCode || 'Process Error'}
- Standard Output: ${Prompt.stdout}

Please analyze the error and provide a complete, corrected version of the code that fixes these issues. Make sure to:
1. Address the specific error message shown above
2. Maintain all the original functionality
3. Include all necessary imports and dependencies
4. Ensure the code follows Manim best practices
5. Return the complete, corrected code that can be run directly
6. Always start the code with "<code>" and end the code with "</code>"

Please respond with only the corrected code in a code block, no explanations needed.
Dont add "Here's the corrected version of the code that addresses the syntax error and maintains all the original functionality:" at the beginning of the code.
Just return the python code.
Always start the code with "<code>" and end the code with "</code>"

`
    }
    else {
        return `
        You are a great software engineer that can create videos using manim python library.
        You need to create a single python file which uses manim python library to create a video which has a main class called "MainScene" which when run create the whole video which satisfies the prompt given by the user.
        Your code will be saved directly to a file called 'a.py ' in the root folder, so make sure it's a complete, runnable script.
        Do not use external svg files.
        
        Include the main execution section at the end of your script like this:
        
        if name == "main":
            with tempconfig(
                {
                    "quality": "medium_quality",
                    "frame_rate": 30,
                    "preview": True,
                }
            ):
                scene = MainScene()
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
            Dont add "Here's a Python script using the Manim library to create a video that shows ..." at the beginning of the code.
            Just return the python code.
            
            Put the code in a <code> tag and end the code with </code> tag.
        
            The prompt is as given below in '\"':
            \"${Prompt}\"
                `
    }
}

export default getPrompt;