"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 font-serif text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-3xl px-6">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 flex items-center justify-center shadow-2xl">
              <span className="text-7xl font-extrablack text-white drop-shadow-2xl">C</span>
            </div>
            <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-full bg-amber-400 shadow-lg flex items-center justify-center animate-bounce">
              <i className="fas fa-crate text-white text-sm"></i>
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-extrablack tracking-tight mb-4">
          CARGO
        </h1>

        <p className="text-3xl text-blue-300 mb-2 font-medium">
          Warehouse Inventory Management System
        </p>

        <p className="text-xl text-gray-400 mb-8">
          Welcome back! Redirecting to your dashboard...
        </p>

        <div className="mb-8 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 max-w-4xl mx-auto">
          <img
            src="/cargo_im.jpg"
            alt="Cargo delivery truck unloading containers at warehouse"
            className="w-full h-auto object-cover rounded-2xl shadow-2xl"
            style={{ maxHeight: '500px', width: '100%' }}
          />
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-2xl font-bold rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center gap-3 mx-auto font-serif"
        >
          <i className="fas fa-tachometer-alt"></i>
          Go to Dashboard
        </button>
      </div>
    </main>
  );
}
