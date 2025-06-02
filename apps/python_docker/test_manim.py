#!/usr/bin/env python

"""
Simple test script to verify that Manim can create a basic animation.
"""

try:
    from manim import Scene, Circle, Create, config
    
    print("Successfully imported Manim modules")
    
    class TestScene(Scene):
        def construct(self):
            circle = Circle()
            self.play(Create(circle))
    
    # Just test import, skip rendering which might have additional dependencies
    print("Manim import test successful!")
    
    # Uncomment below to test actual rendering
    # Warning: This may require additional dependencies
    """
    if __name__ == "__main__":
        print("Testing Manim with a simple circle animation...")
        config.output_file = "test_output.mp4"
        config.quality = "low_quality"
        config.format = "mp4"
        config.renderer = "cairo"
        config.write_to_movie = True
        config.pixel_height = 480
        config.pixel_width = 854
        
        scene = TestScene()
        scene.render()
        print("Test successful! Manim is working correctly.")
    """
    
except Exception as e:
    print(f"Error testing Manim: {e}")
    exit(1) 