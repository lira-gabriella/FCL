"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage(){

  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [statusMessage , setStatusMessage] = useState('');


  const handleLogin = async (e: React.FormEvent) =>{
    e.preventDefault();

    const dataToSend = {
      email: email,
      password: password
    }

    const response = await fetch('/api/login',{
      method:'POST',
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify(dataToSend)
    });

    const result = await response.json();

    if(result.status === 'success'){
      sessionStorage.setItem('userFirstName', result.firstName);
      sessionStorage.setItem('userRole', result.role);
      sessionStorage.setItem('isLoggedIn', 'true');
      setStatusMessage(`Welcome back, ${result.firstName}! Redirecting`);
      window.location.href = '/welcome';
    }else{
      setStatusMessage(result.message || 'Invalid credentials');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-serif">
      <div className="bg-[#f4f2f2] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-300">
        <div className="flex items-center justify-center mb-6">
          <div className="relative mr-4">
            <i className="fas fa-warehouse text-4xl text-blue-700"></i>
            <i className="fas fa-box-open absolute -bottom-1 -right-1 text-lg text-amber-500"></i>
          </div>
          <h2 className="text-4xl font-serif text-gray-900 tracking-wide uppercase">
            LOGIN FORM
          </h2>
        </div>

        <p className="text-center text-gray-600 text-sm font-serif mb-6">
          <i className="fas fa-sign-in-alt mr-2 text-blue-500"></i>
          Enter your credentials to access the system
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xl font-serif text-gray-900 mb-1">
              <i className="fas fa-envelope mr-2 text-blue-500"></i>Email Address
            </label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-serif text-lg" 
            />
          </div>

          <div>
            <label className="block text-xl font-serif text-gray-900 mb-1">
              <i className="fas fa-lock mr-2 text-blue-500"></i>Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-serif text-lg" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#2b8242] hover:bg-green-700 text-white text-xl py-3 rounded transition font-medium shadow-sm font-serif"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Login
          </button>
        </form>

        {statusMessage && (
          <div className={`mt-4 p-3 border rounded text-center font-medium ${
            statusMessage.includes('Welcome') 
              ? 'bg-green-100 border-green-400 text-green-800' 
              : 'bg-red-100 border-red-400 text-red-800'
          }`}>
            {statusMessage}
          </div>
        )}

        <p className="mt-6 text-center text-lg text-gray-900 font-serif">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 underline hover:text-blue-800">
            Register
          </Link>
        </p>

      </div>
    </main>
  );

} 

