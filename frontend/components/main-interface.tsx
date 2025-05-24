"use client";

import { useCallback, useEffect, useState } from 'react';
import { PromptInput } from '@/components/prompt-input';
import { CodeDisplay } from '@/components/code-display';
import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Download, Sparkles, Code2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import dotenv from "dotenv";
import io from "socket.io-client";

dotenv.config();


const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
let URL = "";
export function MainInterface() {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [pythonCode, setPythonCode] = useState<string>("");
  const [slug, setSlug] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusMessage = async (data: any) => {
    console.log("data", data);
    setProjectStatus(data.status);
    if (data.response == "Broadcasting video") {
      let video_status = false;
      while (!video_status) {
        const response = await axios.get(`${URL}`);
        console.log("response", response);
        if (response.status == 200) {
          video_status = true;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      setShowVideo(true);
    }
  }


  const handleCodeMessage = (data: any) => {
    console.log("data", data);
    const { response, chunkNo } = data;
    const code = response.replace("```python", "").replace("```", "").replace("python\n", "");
    setPythonCode((prev) => prev + code);
  }

  useEffect(() => {
    socket.on("llm_response", handleCodeMessage);
    socket.on("project_status", handleStatusMessage);
    return () => {
      socket.off("llm_response", handleCodeMessage);
      socket.off("project_status", handleStatusMessage);
    }
  }, []);


  const handleSubmit = async (prompt: string) => {
    console.log("prompt", prompt);
    setIsLoading(true);
    try {
      if (prompt == null || prompt == "") {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Please enter a prompt",
        });
        return;
      }
      console.log("process.env.NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
      const response: any = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/llm`, {
        "prompt": `${prompt}`,
      }).catch((error) => {
        console.log("Failed to talk to backend", error);
        toast({
          title: "Error",
          description: "Failed to talk to backend",
        });
        return;
      });
      if (response.status == 200) {
        setIsSubmitted(true);
        console.log("response.data", response.data);
        setSlug(response.data.slug);
        socket.emit("join_room", JSON.stringify({ "slug": `${response.data.slug}` }));
        console.log("setting video url: ", `https://d1v9ua0rugj7lf.cloudfront.net/__main/${response.data.slug}.mp4`);
        URL = `https://d1v9ua0rugj7lf.cloudfront.net/__main/${response.data.slug}.mp4`;
        console.log("video url: ", URL);
      }
    } catch (error) {
      console.error('Error submitting prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setPythonCode("");
    // setVideoUrl("");
  };

  const handleDownload = () => {
    if (URL) {
      const link = document.createElement('a');
      link.href = URL;
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
                <CodeDisplay code={pythonCode || ''} className="min-h-[calc(100vh-16rem)]" />
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
              {URL && (
                <>
                  <div className="h-[calc(100%-4rem)]">
                    <video src={URL} controls />
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