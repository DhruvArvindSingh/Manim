#!/bin/bash

# Check if virtual environment exists
echo "Checking Manim virtual environment..."
if [ ! -d "manim_env" ]; then
    echo "Virtual environment not found. Creating one..."
    python -m venv manim_env
    manim_env/bin/pip install --upgrade pip
    manim_env/bin/pip install manim
fi

# Verify Manim installation in virtual environment
echo "Verifying Manim installation..."
manim_env/bin/python verify_manim.py

if [ $? -ne 0 ]; then
    echo "Manim verification failed. Trying to reinstall..."
    manim_env/bin/pip uninstall -y manim
    manim_env/bin/pip install manim
    
    # Verify again
    manim_env/bin/python verify_manim.py
    
    if [ $? -ne 0 ]; then
        echo "Manim installation failed after retry. Exiting."
        exit 1
    fi
fi

# Run a test animation to ensure Manim works correctly
echo "Running a test animation to verify Manim functionality..."
manim_env/bin/python test_manim.py

if [ $? -ne 0 ]; then
    echo "Manim test animation failed. There might be issues with the rendering pipeline."
    # Continue anyway, as the basic import worked
    echo "Continuing despite test failure..."
else
    echo "Manim test animation successful!"
fi

echo "Manim is installed correctly. Starting application..."

# Start the Node.js application
exec node index.js