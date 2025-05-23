"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

export function PromptInput({ onSubmit, isLoading, compact = false }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200",
      compact ? "border-primary/20" : "border-primary/10 hover:border-primary/30"
    )}>
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          placeholder={compact 
            ? "Write a new prompt..." 
            : "Describe the animation you want to create... (e.g., 'Create a circle that transforms into a square')"}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className={cn(
            "resize-none border-0 bg-transparent focus-visible:ring-0",
            "placeholder:text-muted-foreground/60",
            compact ? "min-h-[80px] max-h-[120px] p-4" : "min-h-[120px] p-6"
          )}
        />
        <div className={cn(
          "flex items-center gap-2 border-t bg-muted/50 p-2",
          compact ? "justify-between" : "justify-end"
        )}>
          {!compact && (
            <p className="text-xs text-muted-foreground ml-2">
              Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">Enter</kbd> to submit
            </p>
          )}
          <Button 
            type="submit"
            size={compact ? "sm" : "default"}
            disabled={!prompt.trim() || isLoading}
            className={cn(
              "transition-all",
              isLoading && "opacity-70"
            )}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-primary" />
            ) : (
              <>
                {compact ? (
                  <Send className="h-4 w-4" />
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Animation
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}