"use client";

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white font-serif text-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/cargo_im.jpg')",
          backgroundSize: "50%",
          backgroundPosition: "right center",
          backgroundColor: "#f8fafc",
        }}
      />

      <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-blue-900/85 via-blue-900/30 to-transparent left-0 top-0" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-emerald-600/10 blur-3xl"></div>
      </div>

      <aside className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center py-16 md:py-24 pl-6 md:pl-12 pr-4 md:pr-8 z-10">
        <div className="w-full max-w-md flex flex-col items-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-extrablack text-white drop-shadow-2xl">C</span>
            </div>
            <h1 className="text-7xl font-extrablack tracking-tight">
              CARGO
            </h1>
          </div>

          <p className="text-4xl text-blue-700 mb-4 font-medium">
            Warehouse Inventory Management System
          </p>

          <p className="text-2xl text-gray-600 mb-12 max-w-md leading-relaxed mx-auto md:mx-0">
            Streamline your furniture warehouse operations. Track imports,
            exports, and real-time stock levels with a powerful, intuitive system
            that helps you manage every container and shipment.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
            <Link
              href="/login"
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-2xl font-bold rounded-2xl transition-all shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center gap-3 font-serif"
            >
              <i className="fas fa-sign-in-alt"></i>
              Login
            </Link>
            <Link
              href="/register"
              className="px-12 py-5 bg-transparent border-2 border-blue-500 hover:bg-blue-500 text-blue-700 hover:text-white text-2xl font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center gap-3 font-serif"
            >
              <i className="fas fa-user-plus"></i>
              Register
            </Link>
          </div>
        </div>
      </aside>
    </main>
  );
}
