"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainInterface } from '@/components/main-interface';
import { Header } from '@/components/header';

export default function Home() {
  console.log("process.env.NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
  console.log("process.env.NEXT_PUBLIC_SOCKET_SERVER_URL", process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainInterface />
    </div>
  );
}