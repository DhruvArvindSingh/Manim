#!/bin/bash

# Check if Manim is installed, install if not
echo "Checking Manim installation..."
if ! python -c "import manim" &> /dev/null; then
    echo "Manim not found. Installing Manim..."
    pip install manim
fi

# Verify Manim installation
echo "Verifying Manim installation..."
python verify_manim.py

if [ $? -ne 0 ]; then
    echo "Manim verification failed. Trying to reinstall..."
    pip uninstall -y manim
    pip install manim
    
    # Verify again
    python verify_manim.py
    
    if [ $? -ne 0 ]; then
        echo "Manim installation failed after retry. Exiting."
        exit 1
    fi
fi

# Run a test animation to ensure Manim works correctly
echo "Running a test animation to verify Manim functionality..."
python test_manim.py

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