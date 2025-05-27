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
      <div className="container flex h-20 items-center justify-between mx-auto px-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-16">
          <Link
            href="/"
            className="flex items-center space-x-5 transition-all duration-300 hover:opacity-80 hover:scale-105"
          >
            <div className="relative">
              <Sparkles className="h-9 w-9 text-primary animate-pulse" />
              <div className="absolute inset-0 blur-lg opacity-50">
                <Sparkles className="h-9 w-9 text-primary" />
              </div>
            </div>
            <span className="font-bold text-3xl tracking-tight sm:inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Animath
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="group flex items-center space-x-3 text-xl font-medium transition-all duration-300 hover:text-primary transform hover:scale-105"
            >
              <div className="relative">
                <Code2 className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-30">
                  <Code2 className="h-7 w-7 text-primary" />
                </div>
              </div>
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                Create
              </span>
            </Link>
            <Link
              href="/explore"
              className="group flex items-center space-x-3 text-xl font-medium text-muted-foreground transition-all duration-300 hover:text-primary transform hover:scale-105"
            >
              <div className="relative">
                <Sparkles className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-all duration-300" />
                <div className="absolute inset-0 blur-sm opacity-0 group-hover:opacity-30">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                Explore
              </span>
            </Link>
          </div>
        </div>

        <nav className="flex items-center space-x-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-12 w-12 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            {theme === 'light' ?
              <MoonIcon className="h-7 w-7 transition-all duration-300" /> :
              <SunIcon className="h-7 w-7 transition-all duration-300" />
            }
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-12 w-12 rounded-lg hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            <a
              href="https://github.com/DhruvArvindSingh"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
            >
              <GithubIcon className="h-7 w-7 transition-all duration-300" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}