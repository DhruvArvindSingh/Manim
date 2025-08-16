"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, GithubIcon, Sparkles, Code2 } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto px-6">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Animath
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-primary"
            >
              <Code2 className="h-4 w-4" />
              <span>Create</span>
            </Link>
            <Link
              href="/explore"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>Explore</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9 rounded-lg hover:bg-primary/10 transition-all duration-300"
          >
            {theme === 'light' ?
              <MoonIcon className="h-4 w-4" /> :
              <SunIcon className="h-4 w-4" />
            }
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 w-9 rounded-lg hover:bg-primary/10 transition-all duration-300"
          >
            <a
              href="https://github.com/DhruvArvindSingh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
            >
              <GithubIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}