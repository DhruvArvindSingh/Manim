"use client";

import { useEffect, useState } from 'react';
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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [pythonCode, setPythonCode] = useState<string>("");
  const [slug, setSlug] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusMessage = async (data: any) => {
    console.log("data.response", data.response);
    (data.response.startsWith("{")) ? URL = JSON.parse(data.response).link : setProjectStatus(data.response);
    if (data.response == "Error in running code.. solving error") {
      setPythonCode("");
    }
    if (data.response == "Broadcasting video") {
      setIsRunning(false);
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
    if (data.response == "Too many errors, giving up") {
      setShowVideo(false);
      setPythonCode("");
      setSlug(null);
      setTimeout(() => {
        setIsRunning(false);
        setIsSubmitted(false);
      }, 1000);
      toast({
        title: "Error",
        description: "Too many errors, giving up",
      });
    }
  }


  const handleCodeMessage = (data: any) => {
    console.log("data", data);
    const { response, chunkNo } = data;
    const code = response.replace("```python", "").replace("```", "").replace("python\n", "").replace("<code>", "").replace("</code>", "");
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
    if (isRunning) {
      toast({
        title: "Error",
        description: "Please wait for the current animation to finish",
      });
      return;
    }
    console.log("prompt", prompt);
    setIsRunning(true);
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
      let response: any;
      if (pythonCode != "") {
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/llm_rerun`, {
          "prompt": `${prompt}`,
          "code": `${pythonCode}`,
        }).catch((error) => {
          console.log("Failed to talk to backend", error);
          toast({
            title: "Error",
            description: "Failed to talk to backend",
          });
          return;
        });
        setPythonCode("");
        setShowVideo(false);
        URL = "";
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/llm`, {
          "prompt": `${prompt}`,
        }).catch((error) => {
          console.log("Failed to talk to backend", error);
          toast({
            title: "Error",
            description: "Failed to talk to backend",
          });
          return;
        });
      }
      if (response.status == 200) {
        setIsSubmitted(true);
        console.log("response.data", response.data);
        setSlug(response.data.slug);
        setProjectStatus(response.data.status);
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
    setIsRunning(false);
    setShowVideo(false);
    URL = "";
    setProjectStatus(null);
    setSlug(null);
    setIsSubmitted(false);
    setPythonCode("");
  };

  const handleDownload = async () => {
    if (slug) {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-signed-url/${slug}`);
        if (response.data.signedUrl) {
          const link = document.createElement('a');
          link.href = response.data.signedUrl;
          link.download = 'manim-animation.mp4';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          toast({
            title: "Error",
            description: "Failed to get download URL",
          });
        }
      } catch (error) {
        console.error('Error getting signed URL:', error);
        toast({
          title: "Error",
          description: "Failed to get download URL",
        });
      }
    }
  };


  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative">
      <MathBackground />
      {!isSubmitted ? (
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
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-[calc(100vh-8rem)]">
            {/* Code Panel */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Generated Code</h2>
                  <p className="text-sm text-muted-foreground">Manim Python script</p>
                </div>
              </div>

              <Card className="flex-1 overflow-hidden border-border/50">
                <CodeDisplay code={pythonCode || ''} className="h-full" />
              </Card>

              <div className="mt-4">
                <PromptInput onSubmit={handleSubmit} isLoading={isLoading} compact />
              </div>
            </div>

            {/* Animation Panel */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-chart-1/10 rounded-lg">
                  <Video className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Animation Preview</h2>
                  <p className="text-sm text-muted-foreground">Generated video output</p>
                </div>
              </div>

              <Card className="flex-1 overflow-hidden border-border/50">
                {URL ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center bg-muted/20">
                      {showVideo ? (
                        <video
                          src={URL}
                          controls
                          className="max-h-full max-w-full object-contain rounded-lg"
                          style={{ maxHeight: 'calc(100% - 4rem)' }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-4">
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <div className="text-center">
                            <p className="text-lg font-medium text-primary">{projectStatus || 'Processing'}...</p>
                            <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t bg-muted/30 flex justify-between items-center">
                      <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        New Animation
                      </Button>

                      {showVideo && (
                        <Button onClick={handleDownload} size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Animation will appear here</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}