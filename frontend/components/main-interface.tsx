"use client";

import { useState } from 'react';
import { PromptInput } from '@/components/prompt-input';
import { CodeDisplay } from '@/components/code-display';
import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Code2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type ResultState = {
  pythonCode: string | null;
  videoUrl: string | null;
};

export function MainInterface() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState>({
    pythonCode: null,
    videoUrl: null,
  });

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);

    try {
      // Simulate API call to the backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response from backend
      const mockPythonCode = `from manim import *

class CreateCircle(Scene):
    def construct(self):
        circle = Circle()  # create a circle
        circle.set_fill(BLUE, opacity=0.5)  # set the color and transparency
        self.play(Create(circle))  # show the circle on screen`;

      // Mock video URL (would come from CloudFront in production)
      const mockVideoUrl = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";

      setResult({
        pythonCode: mockPythonCode,
        videoUrl: mockVideoUrl,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setResult({
      pythonCode: null,
      videoUrl: null,
    });
  };

  const handleDownload = () => {
    if (result.videoUrl) {
      const link = document.createElement('a');
      link.href = result.videoUrl;
      link.download = 'manim-animation.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={cn(
      "container flex max-w-screen-2xl flex-1 flex-col transition-all duration-300 ease-in-out",
      isSubmitted ? "pt-2" : "pt-8 md:pt-16"
    )}>
      {!isSubmitted ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-4xl px-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute inset-0 blur-lg opacity-50">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="mb-4 text-center text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/60">
              Create mathematical animations with AI
            </h1>
            <p className="mb-8 text-center text-muted-foreground text-lg md:text-xl">
              Enter your prompt below and Manim AI will generate a Python code using Manim to create your animation.
            </p>
            <div className="max-w-3xl mx-auto">
              <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
                <Code2 className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Python Code Generation</h3>
                <p className="text-sm text-muted-foreground">Automatically generates Manim Python code from your description</p>
              </Card>

              <Card className="p-6 text-center bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
                <Video className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Video Rendering</h3>
                <p className="text-sm text-muted-foreground">Renders high-quality mathematical animations in real-time</p>
              </Card>

              <Card className="p-6 text-center bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
                <Download className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Easy Download</h3>
                <p className="text-sm text-muted-foreground">Download your animations for use in presentations or tutorials</p>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col h-full">
            <div className="flex-1 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Generated Python Code</h2>
              </div>
              <Card className="h-[calc(100%-2rem)] overflow-hidden border-primary/20">
                <CodeDisplay code={result.pythonCode || ''} className="min-h-[calc(100vh-16rem)]" />
              </Card>
            </div>
            <div className="sticky bottom-4 bg-background/95 backdrop-blur pt-4">
              <PromptInput onSubmit={handleSubmit} isLoading={isLoading} compact />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Generated Animation</h2>
            </div>
            <Card className="flex-1 overflow-hidden border-primary/20">
              {result.videoUrl && (
                <>
                  <div className="h-[calc(100%-4rem)]">
                    <VideoPlayer url={result.videoUrl} />
                  </div>
                  <div className="p-4 flex justify-between items-center border-t">
                    <Button onClick={handleReset} variant="outline" size="sm">
                      New Animation
                    </Button>
                    <Button onClick={handleDownload} variant="default" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Video
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}