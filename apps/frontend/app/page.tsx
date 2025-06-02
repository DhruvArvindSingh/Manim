"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainInterface } from '@/components/main-interface';
import { Header } from '@/components/header';

export default function Home() {


  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, loading, router]);

  // if (loading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center bg-background">
  //       <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null; // Will redirect in useEffect
  // }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="flex-1">
        <Header />
        <MainInterface />
      </div>
    </main>
  );
}