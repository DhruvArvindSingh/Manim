"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PromptInput } from '@/components/prompt-input';
import { CodeDisplay } from '@/components/code-display';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Download, Sparkles, Code2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import dotenv from "dotenv";
import { Loader2 } from 'lucide-react';
import io from "socket.io-client";
import { MathBackground } from '@/components/math-background';

dotenv.config();


const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
let URL = "";
export function MainInterface() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();




  const handleSubmit = async (prompt: string) => {
    if (!prompt || prompt.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a prompt",
      });
      return;
    }

    // Redirect to chat page with the prompt as a URL parameter
    const encodedPrompt = encodeURIComponent(prompt.trim());
    router.push(`/chat?prompt=${encodedPrompt}`);
  };





  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative">
      <MathBackground />
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-chart-1/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-chart-2/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Header */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4 sm:mb-6">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Mathematical Animations</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text text-transparent leading-tight">
                Create stunning
                <br />
                <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
                  mathematical animations
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                Transform your mathematical concepts into beautiful animations with the power of AI.
                Simply describe what you want, and watch your ideas come to life.
              </p>
            </div>

            {/* Prompt Input */}
            <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
              <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
              <Card className="group p-4 sm:p-6 lg:p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Smart Code Generation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI automatically generates optimized Manim Python code from your natural language descriptions
                  </p>
                </div>
              </Card>

              <Card className="group p-4 sm:p-6 lg:p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-chart-1/10 rounded-2xl mb-4 group-hover:bg-chart-1/20 transition-colors">
                    <Video className="h-8 w-8 text-chart-1" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Real-time Rendering</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Watch your animations render in real-time with high-quality output and smooth performance
                  </p>
                </div>
              </Card>

              <Card className="group p-4 sm:p-6 lg:p-8 bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-chart-2/10 rounded-2xl mb-4 group-hover:bg-chart-2/20 transition-colors">
                    <Download className="h-8 w-8 text-chart-2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Export & Share</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Download your animations in high quality for presentations, tutorials, or educational content
                  </p>
                </div>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">AI</div>
                <div className="text-sm text-muted-foreground">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4K</div>
                <div className="text-sm text-muted-foreground">Quality</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">⚡</div>
                <div className="text-sm text-muted-foreground">Fast</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}