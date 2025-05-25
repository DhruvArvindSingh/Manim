"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Sparkles, Eye, Code2, Video, Zap, Triangle, Square, Circle, Hexagon, LucideIcon } from 'lucide-react';
import { Header } from "@/components/header";

// Utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

interface VideoCard {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    category: CategoryType;
    shape: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
}

type CategoryType = 'Transformations' | '3D Shapes' | 'Mathematical Functions' | 'Complex Shapes' | 'Mathematical Art';

const videoCards: VideoCard[] = [
    {
        id: "1",
        title: "Beauty of Math",
        description: "A beautiful animation of the beauty of math",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748173470350-quaint-bored-processor.mp4",
        category: "Mathematical Art",
        shape: "Circle",
        difficulty: "Beginner",
        duration: "2.5s"
    },
    {
        id: "2",
        title: "Square to Circle",
        description: "Morphing animation demonstrating geometric transformation principles",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748188475875-wailing-few-tiger.mp4",
        category: "Transformations",
        shape: "Square",
        difficulty: "Intermediate",
        duration: "3.2s"
    },
    {
        id: "3",
        title: "3D Cube Rotation",
        description: "Three-dimensional cube rotating with perspective and lighting effects",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748187429351-bashful-alive-manchester.mp4",
        category: "3D Shapes",
        shape: "Cube",
        difficulty: "Advanced",
        duration: "4.1s"
    },
    {
        id: "4",
        title: "Wave Function",
        description: "Animated sine wave super imposition in 3D space",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748185351493-fancy-abrasive-book.mp4",
        category: "Mathematical Functions",
        shape: "Wave",
        difficulty: "Intermediate",
        duration: "5.0s"
    },
    {
        id: "5",
        title: "Polygon Morphing",
        description: "Complex polygon transformation showcasing vertex interpolation",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748185850781-rough-brave-needle.mp4",
        category: "Complex Shapes",
        shape: "Polygon",
        difficulty: "Advanced",
        duration: "6.3s"
    },
    {
        id: "6",
        title: "Spiral Animation",
        description: "Logarithmic spiral with golden ratio mathematical principles",
        videoUrl: "https://d1v9ua0rugj7lf.cloudfront.net/__main/1748186571777-refined-yummy-summer.mp4",
        category: "Mathematical Art",
        shape: "Spiral",
        difficulty: "Intermediate",
        duration: "4.8s"
    }
];

const categories = Array.from(new Set(videoCards.map(card => card.category)));

const categoryIcons: Record<CategoryType, LucideIcon> = {
    // "Basic Shapes": Circle,
    "Transformations": Square,
    "3D Shapes": Hexagon,
    "Mathematical Functions": Triangle,
    "Complex Shapes": Hexagon,
    "Mathematical Art": Sparkles
} as const;

const categoryColors: Record<CategoryType, string> = {
    // "Basic Shapes": "from-blue-500 to-cyan-500",
    "Transformations": "from-purple-500 to-pink-500",
    "3D Shapes": "from-green-500 to-emerald-500",
    "Mathematical Functions": "from-orange-500 to-red-500",
    "Complex Shapes": "from-indigo-500 to-purple-500",
    "Mathematical Art": "from-rose-500 to-pink-500"
} as const;

const difficultyColors: Record<VideoCard['difficulty'], string> = {
    "Beginner": "bg-green-500/20 text-green-300 border-green-500/50",
    "Intermediate": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    "Advanced": "bg-red-500/20 text-red-300 border-red-500/50"
} as const;

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    const filteredCards = selectedCategory
        ? videoCards.filter(card => card.category === selectedCategory)
        : videoCards;

    const toggleVideo = (cardId: string) => {
        const video = videoRefs.current[cardId];
        if (video) {
            if (playingVideos.has(cardId)) {
                video.pause();
                setPlayingVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(cardId);
                    return newSet;
                });
            } else {
                video.play();
                setPlayingVideos(prev => new Set(prev).add(cardId));
            }
        }
    };

    useEffect(() => {
        // Auto-play all videos on mount
        Object.values(videoRefs.current).forEach(video => {
            if (video) {
                video.play().catch(() => {
                    // Handle autoplay restriction
                });
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
            <Header />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary/10 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="text-center mb-16 pt-4">
                    <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-foreground/80 font-medium">Mathematical Visualizations</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                        Explore Animations
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Discover a curated collection of mathematical animations created with Manim AI.
                        From basic geometric shapes to complex mathematical visualizations.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
                    <Card className="p-4 text-center bg-card/50 backdrop-blur border-primary/20">
                        <div className="text-2xl font-bold text-primary mb-1">{videoCards.length}</div>
                        <div className="text-sm text-muted-foreground">Animations</div>
                    </Card>
                    <Card className="p-4 text-center bg-card/50 backdrop-blur border-primary/20">
                        <div className="text-2xl font-bold text-primary mb-1">{categories.length}</div>
                        <div className="text-sm text-muted-foreground">Categories</div>
                    </Card>
                    <Card className="p-4 text-center bg-card/50 backdrop-blur border-primary/20">
                        <div className="text-2xl font-bold text-primary mb-1">3</div>
                        <div className="text-sm text-muted-foreground">Difficulty Levels</div>
                    </Card>
                    <Card className="p-4 text-center bg-card/50 backdrop-blur border-primary/20">
                        <div className="text-2xl font-bold text-primary mb-1">AI</div>
                        <div className="text-sm text-muted-foreground">Generated</div>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <Button
                        variant={selectedCategory === null ? "default" : "outline"}
                        onClick={() => setSelectedCategory(null)}
                        className="h-11 px-6 font-medium"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        All Categories
                    </Button>
                    {categories.map((category) => {
                        const IconComponent = categoryIcons[category];
                        return (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="h-11 px-6 font-medium"
                            >
                                <IconComponent className="w-4 h-4 mr-2" />
                                {category}
                            </Button>
                        );
                    })}
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {filteredCards.map((card, index) => (
                        <div
                            key={card.id}
                            className="group"
                            onMouseEnter={() => setHoveredCard(card.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
                            }}
                        >
                            <Card className="overflow-hidden bg-card/90 backdrop-blur-sm border border-border/40 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 group-hover:bg-card/95">
                                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                                    {/* Compact Badges */}
                                    <div className="absolute top-2 left-2 z-20">
                                        <div className={cn(
                                            "px-2 py-1 rounded-md text-xs font-bold text-white bg-gradient-to-r shadow-md backdrop-blur-sm",
                                            categoryColors[card.category]
                                        )}>
                                            {card.category.split(' ')[0]}
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-2 right-2 z-20 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                                        {card.duration}
                                    </div>

                                    {/* Difficulty Indicator */}
                                    <div className="absolute bottom-2 left-2 z-20">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full border",
                                            card.difficulty === 'Beginner' && "bg-green-400 border-green-300",
                                            card.difficulty === 'Intermediate' && "bg-yellow-400 border-yellow-300",
                                            card.difficulty === 'Advanced' && "bg-red-400 border-red-300"
                                        )}></div>
                                    </div>

                                    {/* Play/Pause Overlay */}
                                    <div className={cn(
                                        "absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all duration-300 cursor-pointer",
                                        hoveredCard === card.id ? "opacity-100" : "opacity-0"
                                    )}
                                        onClick={() => toggleVideo(card.id)}
                                    >
                                        <div className="bg-white/25 backdrop-blur-sm rounded-full p-3 border border-white/40 hover:bg-white/35 transition-all duration-200 hover:scale-110">
                                            {playingVideos.has(card.id) ? (
                                                <Pause className="w-6 h-6 text-white" />
                                            ) : (
                                                <Play className="w-6 h-6 text-white fill-white" />
                                            )}
                                        </div>
                                    </div>

                                    <video
                                        ref={el => videoRefs.current[card.id] = el}
                                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                                        loop
                                        muted
                                        playsInline
                                    // onPlay={() => setPlayingVideos(prev => new Set(prev).add(card.id))}
                                    // onPause={() => setPlayingVideos(prev => {
                                    //     const newSet = new Set(prev);
                                    //     newSet.delete(card.id);
                                    //     return newSet;
                                    // })}
                                    >
                                        <source src={card.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                    {/* Enhanced Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                                </div>

                                <div className="p-4 relative">
                                    <div className="mb-2">
                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                            {card.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Video className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{card.shape}</span>
                                            <div className={cn(
                                                "ml-auto px-2 py-0.5 rounded-full text-xs font-medium",
                                                difficultyColors[card.difficulty]
                                            )}>
                                                {card.difficulty[0]}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300 mb-3 line-clamp-2">
                                        {card.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0 hover:bg-primary/20 rounded-full"
                                            onClick={() => toggleVideo(card.id)}
                                        >
                                            {playingVideos.has(card.id) ? (
                                                <Pause className="w-3 h-3" />
                                            ) : (
                                                <Play className="w-3 h-3" />
                                            )}
                                        </Button>

                                        <Button size="sm" variant="ghost" className="h-7 px-3 text-xs hover:bg-primary/10">
                                            <Download className="w-3 h-3 mr-1" />
                                            Get
                                        </Button>
                                    </div>

                                    {/* Enhanced Hover Effect Bar */}
                                    <div className={cn(
                                        "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-500",
                                        categoryColors[card.category],
                                        hoveredCard === card.id ? "w-full opacity-100" : "w-0 opacity-0"
                                    )}></div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20">
                    <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <Zap className="h-16 w-16 text-primary animate-pulse" />
                                <div className="absolute inset-0 blur-lg opacity-50">
                                    <Zap className="h-16 w-16 text-primary" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Ready to Create Your Own?
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Use Manim AI to generate custom mathematical animations from simple text descriptions.
                            No coding experience required.
                        </p>
                        <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                            <Code2 className="w-5 h-5 mr-2" />
                            Start Creating
                        </Button>
                    </Card>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                
                .bg-grid-pattern {
                    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
                    background-size: 20px 20px;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}