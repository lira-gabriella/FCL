"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    const dataToSend = { email, password };
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (result.status === 'success') {
      sessionStorage.setItem('userFirstName', result.firstName);
      sessionStorage.setItem('userRole', result.role);
      sessionStorage.setItem('isLoggedIn', 'true');
      setStatusMessage(`Welcome back, ${result.firstName}! Redirecting`);
      window.location.href = '/welcome';
    } else {
      setStatusMessage(result.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
<main className="min-h-screen flex items-center justify-center bg-white p-4 font-sans">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-emerald-500 shadow-2xl mb-4">
            <i className="fas fa-warehouse text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl font-extrablack tracking-tight text-slate-900">
            CARGO
          </h1>
          <p className="text-blue-600 text-lg font-medium mt-1">
            Warehouse Inventory Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <i className="fas fa-sign-in-alt text-blue-600"></i>
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Sign in to access your warehouse dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <i className="fas fa-envelope text-blue-500"></i>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <i className="fas fa-lock text-blue-500"></i>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
              />
            </div>

            {statusMessage && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                statusMessage.includes('Welcome')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {statusMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Secure warehouse management system
        </p>
      </div>
    </main>
  );
}