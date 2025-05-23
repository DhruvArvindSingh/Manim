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
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-md bg-background/80 hover:bg-background"
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
      <pre className="overflow-x-auto p-4 text-sm">
        <code className="block whitespace-pre font-mono text-sm">{code}</code>
      </pre>
    </Card>
  );
}