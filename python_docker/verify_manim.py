#!/usr/bin/env python

"""
Script to verify that Manim is installed correctly.
Run this script with: python verify_manim.py
"""

try:
    import manim
    print("Manim is installed correctly!")
    
    # Print Manim version if available
    try:
        print(f"Manim version: {manim.__version__}")
    except AttributeError:
        print("Manim version information not available")
    
    # Check for essential modules
    essential_modules = ["constants", "animation", "camera", "mobject", "scene"]
    missing_modules = []
    
    for module in essential_modules:
        if not hasattr(manim, module):
            missing_modules.append(module)
    
    if missing_modules:
        print(f"Warning: Some essential modules are missing: {', '.join(missing_modules)}")
    else:
        print("All essential Manim modules are available.")
    
    print("Manim verification complete.")
    
except ImportError as e:
    print(f"Error: {e}")
    print("Manim is not installed correctly.")
    print("Please check your installation and try again.")
    exit(1) 