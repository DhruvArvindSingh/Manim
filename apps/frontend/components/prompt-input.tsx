"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Wand2, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

const promptSuggestions = [
  "Create a circle that transforms into a square",
  "Show the Pythagorean theorem with animated triangles",
  "Animate a sine wave morphing into a cosine wave",
  "Visualize the golden ratio with a spiral",
  "Create a 3D rotating cube with mathematical equations",
  "Show prime numbers on a number line with highlighting",
  "Animate the concept of derivatives with a tangent line",
  "Create a fractal tree growing with mathematical precision"
];

export function PromptInput({ onSubmit, isLoading, compact = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      if (!compact) {
        setPrompt('');
        setCharCount(0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
  };

  const selectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setCharCount(suggestion.length);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const clearPrompt = () => {
    setPrompt('');
    setCharCount(0);
    textareaRef.current?.focus();
  };

  const getRandomSuggestion = () => {
    const randomSuggestion = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
    selectSuggestion(randomSuggestion);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  return (
    <div className="relative">
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        compact
          ? "border-border/50 hover:border-primary/40"
          : "border-border/30 hover:border-primary/50 shadow-lg hover:shadow-xl hover:shadow-primary/10",
        isLoading && "ring-2 ring-primary/20"
      )}>
        <form onSubmit={handleSubmit} className="relative">
          {/* Header for non-compact mode */}
          {!compact && (
            <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-2 border-b border-border/30">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium text-primary">Describe your animation</span>
                </div>
                <div className="flex items-center gap-2">
                  {prompt && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearPrompt}
                      className="h-7 px-2 text-xs hover:bg-muted"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="h-7 px-2 text-xs hover:bg-muted"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Examples</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={compact
                ? "Describe your next animation..."
                : "e.g., 'Create a circle that transforms into a square with smooth animation'"}
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "resize-none border-0 bg-transparent focus-visible:ring-0 transition-all",
                "placeholder:text-muted-foreground/60",
                compact
                  ? "min-h-[80px] max-h-[140px] p-3 sm:p-4 text-sm sm:text-base"
                  : "min-h-[100px] max-h-[200px] p-4 sm:p-6 text-sm sm:text-base"
              )}
              disabled={isLoading}
            />

            {/* Character count and actions */}
            <div className={cn(
              "flex items-center justify-between border-t bg-muted/30",
              compact ? "px-3 py-2" : "px-4 sm:px-6 py-2 sm:py-3"
            )}>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {!compact && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={getRandomSuggestion}
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs hover:bg-background"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Inspire me</span>
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">
                  {charCount}/500 {!compact && <span className="hidden sm:inline">• Shift+Enter for new line</span>}
                </span>
              </div>

              <Button
                type="submit"
                size={compact ? "sm" : "default"}
                disabled={!prompt.trim() || isLoading || charCount > 500}
                className={cn(
                  "transition-all gap-2",
                  isLoading && "opacity-70",
                  !compact && "px-4 sm:px-6"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {!compact && <span className="hidden sm:inline">Generating...</span>}
                  </>
                ) : (
                  <>
                    {compact ? (
                      <Send className="h-4 w-4" />
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Generate Animation</span>
                        <span className="sm:hidden">Generate</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Suggestions dropdown */}
      {showSuggestions && !compact && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto bg-background/95 backdrop-blur border-border/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Try these examples:</span>
            </div>
            <div className="space-y-2">
              {promptSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm border border-transparent hover:border-border/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}