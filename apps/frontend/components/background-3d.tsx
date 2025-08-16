"use client";

import React from 'react';

export function Background3D() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Simple CSS-based animated background */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20">
                {/* Floating geometric shapes */}
                <div className="absolute top-10 left-10 w-16 h-16 border-2 border-primary/30 rotate-12 animate-spin-slow"></div>
                <div className="absolute top-32 right-20 w-12 h-12 border-2 border-chart-1/30 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-64 left-1/4 w-20 h-20 border-2 border-chart-2/30 rotate-45 animate-pulse"></div>
                <div className="absolute bottom-40 right-10 w-14 h-14 border-2 border-chart-3/30 animate-spin-slow"></div>
                <div className="absolute bottom-20 left-16 w-10 h-10 border-2 border-chart-4/30 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-1/2 right-1/3 w-18 h-18 border-2 border-chart-5/30 rotate-12 animate-pulse"></div>

                {/* Triangles */}
                <div className="absolute top-48 right-16 w-0 h-0 border-l-8 border-r-8 border-b-14 border-l-transparent border-r-transparent border-b-chart-3/20 animate-float-slow"></div>
                <div className="absolute bottom-48 right-1/3 w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-chart-4/20 animate-float-medium"></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    );
}
