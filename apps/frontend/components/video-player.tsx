"use client";

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  className?: string;
}

export function VideoPlayer({ url, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoRef.current.muted = newMutedState;
  };
  
  const handleTimeChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const enterFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn("relative aspect-video w-full bg-black", className)} 
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="h-full w-full"
        playsInline
        onClick={togglePlay}
      />
      
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleTimeChange}
            className="h-1"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>
              
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24 h-1"
              />
            </div>
            
            <span className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white"
            onClick={enterFullscreen}
          >
            <Maximize className="h-4 w-4" />
            <span className="sr-only">Fullscreen</span>
          </Button>
        </div>
      </div>
    </div>
  );
}