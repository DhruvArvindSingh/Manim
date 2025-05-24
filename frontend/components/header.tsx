"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, GithubIcon, Sparkles, BookOpen, Code2 } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-24">
          <Link href="/" className="flex items-center space-x-5 transition-opacity hover:opacity-80">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 blur-sm opacity-50">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tight sm:inline-block">Manim AI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-12">
            <Link
              href="/"
              className="group flex items-center space-x-3 text-xl font-medium transition-colors hover:text-primary"
            >
              <Code2 className="h-7 w-7 opacity-70 group-hover:opacity-100" />
              <span>Create</span>
            </Link>
            <Link
              href="#"
              className="group flex items-center space-x-3 text-xl font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Sparkles className="h-7 w-7 opacity-70 group-hover:opacity-100" />
              <span>Examples</span>
            </Link>
            <Link
              href="#"
              className="group flex items-center space-x-3 text-xl font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <BookOpen className="h-7 w-7 opacity-70 group-hover:opacity-100" />
              <span>Documentation</span>
            </Link>
          </nav>
        </div>

        <nav className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-12 w-12 hover:bg-primary/10"
          >
            {theme === 'light' ? <MoonIcon className="h-7 w-7" /> : <SunIcon className="h-7 w-7" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" size="icon" asChild className="h-12 w-12 hover:bg-primary/10">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-7 w-7" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          {user ? (
            <Button variant="outline" onClick={logout} className="h-12 px-10 shadow-sm text-xl">
              Sign Out
            </Button>
          ) : (
            <Button variant="default" asChild className="h-12 px-10 shadow-sm text-xl">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}