"use client";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface CodeDisplayProps {
  code: string;
  className?: string;
}

export function CodeDisplay({ code, className }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative h-full", className)}>
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-md bg-background/80 hover:bg-background backdrop-blur-sm"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <div className="h-full overflow-y-auto overflow-x-auto scrollbar-hide">
        <pre className="p-4 text-sm min-w-max">
          <code className="block whitespace-pre font-mono language-python">{code}</code>
        </pre>
      </div>
    </div>
  );
}