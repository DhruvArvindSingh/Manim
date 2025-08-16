"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PromptInput } from '@/components/prompt-input';
import { CodeDisplay } from '@/components/code-display';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Download, Sparkles, Code2, Video, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import io from "socket.io-client";
import { Header } from '@/components/header';

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);
let URL = "";

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get('prompt');

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

    // Auto-submit initial prompt if provided
    useEffect(() => {
        if (initialPrompt && !isRunning) {
            handleSubmit(initialPrompt);
        }
    }, [initialPrompt]);

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

    const goBack = () => {
        router.push('/');
    };

    return (
        <div className="h-screen bg-background overflow-hidden">
            <Header />

            <div className="h-[calc(100vh-3.5rem)] flex flex-col">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col overflow-hidden">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={goBack}
                            className="gap-2 hover:bg-muted"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 flex-1 overflow-hidden">
                        {/* Code Panel */}
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Code2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Generated Code</h2>
                                    <p className="text-sm text-muted-foreground">Manim Python script</p>
                                </div>
                            </div>

                            <Card className="flex-1 overflow-hidden border-border/50 min-h-0">
                                {pythonCode ? (
                                    <CodeDisplay code={pythonCode} className="h-full" />
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <Code2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                            <p>Generated code will appear here</p>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <div className="mt-4 flex-shrink-0">
                                <PromptInput onSubmit={handleSubmit} isLoading={isLoading} compact />
                            </div>
                        </div>

                        {/* Animation Panel */}
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                                <div className="p-2 bg-chart-1/10 rounded-lg">
                                    <Video className="h-5 w-5 text-chart-1" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Animation Preview</h2>
                                    <p className="text-sm text-muted-foreground">Generated video output</p>
                                </div>
                            </div>

                            <Card className="flex-1 overflow-hidden border-border/50 min-h-0">
                                {URL || isRunning ? (
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
            </div>
        </div>
    );
}
