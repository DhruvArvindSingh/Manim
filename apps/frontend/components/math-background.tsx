"use client";

import React from 'react';

export function MathBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Mathematical formulas floating in background */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                {/* Floating mathematical expressions */}
                <div className="absolute top-10 left-10 text-6xl font-thin text-primary animate-float-slow">
                    ∫ f(x)dx
                </div>
                <div className="absolute top-32 right-20 text-4xl font-thin text-chart-1 animate-float-medium">
                    ∑(n=1 to ∞)
                </div>
                <div className="absolute top-64 left-1/4 text-5xl font-thin text-chart-2 animate-float-fast">
                    π = 3.14159...
                </div>
                <div className="absolute bottom-40 right-10 text-4xl font-thin text-chart-3 animate-float-slow">
                    e^(iπ) + 1 = 0
                </div>
                <div className="absolute bottom-20 left-16 text-3xl font-thin text-chart-4 animate-float-medium">
                    √(a² + b²)
                </div>
                <div className="absolute top-1/2 right-1/3 text-5xl font-thin text-chart-5 animate-float-fast">
                    lim(x→∞)
                </div>
                <div className="absolute top-20 left-2/3 text-4xl font-thin text-primary animate-float-slow">
                    ∂f/∂x
                </div>
                <div className="absolute bottom-1/3 left-1/2 text-3xl font-thin text-chart-1 animate-float-medium">
                    f'(x) = dy/dx
                </div>
            </div>

            {/* Geometric shapes */}
            <div className="absolute inset-0 opacity-3 dark:opacity-5">
                {/* 2D Shapes */}
                <div className="absolute top-16 right-1/4 w-32 h-32 border-2 border-primary/20 rotate-12 animate-spin-slow"></div>
                <div className="absolute bottom-32 left-1/3 w-24 h-24 border-2 border-chart-1/20 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-1/3 left-20 w-20 h-20 border-2 border-chart-2/20 rotate-45 animate-pulse"></div>

                {/* Triangles */}
                <div className="absolute top-48 right-16 w-0 h-0 border-l-16 border-r-16 border-b-28 border-l-transparent border-r-transparent border-b-chart-3/20 animate-float-slow"></div>
                <div className="absolute bottom-48 right-1/3 w-0 h-0 border-l-12 border-r-12 border-b-20 border-l-transparent border-r-transparent border-b-chart-4/20 animate-float-medium"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-2 dark:opacity-5">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Sine wave */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 dark:opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 800 128" className="text-primary">
                    <path
                        d="M0,64 Q100,32 200,64 T400,64 T600,64 T800,64"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-wave"
                    />
                </svg>
            </div>

            {/* Parabola */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 dark:opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 256 256" className="text-chart-1">
                    <path
                        d="M32,224 Q128,32 224,224"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="animate-pulse"
                    />
                </svg>
            </div>

            {/* Spiral */}
            <div className="absolute top-1/2 left-1/4 w-48 h-48 opacity-5 dark:opacity-10 animate-spin-very-slow">
                <svg width="100%" height="100%" viewBox="0 0 192 192" className="text-chart-2">
                    <path
                        d="M96,96 m-8,0 a8,8 0 1,1 16,0 a16,16 0 1,1 -32,0 a24,24 0 1,1 48,0 a32,32 0 1,1 -64,0 a40,40 0 1,1 80,0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}
