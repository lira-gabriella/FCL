
"use client";

import { useState } from "react";

export default function LoginPage(){

    const[email ,setEmail] = useState('');
    const[password , setPassword] = useState('');
    const[statusMessage , setStatusMessage] = useState('');


    const handleLogin = async (e: React.FormEvent) =>{
        e.preventDefault();

        const dataToSend = {
            email:email,
            password:password
        }

        const response = await fetch('http://127.0.0.1:8000/api/login',{
            method:'POST',
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify(dataToSend)
        });

        const result = await response.json();

        if(result.status === 'success'){
            setStatusMessage(`Welcome back , ${result.firstName}! Redirecting`);
            window.location.href = '/dashboard';
        }else{
            setStatusMessage(result.message || 'invalid credentials');
        }
    };



  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-[#f4f2f2] p-8 rounded shadow-xl w-full max-w-md border border-gray-300">
        
        <h2 className="text-3xl font-serif text-center text-gray-900 tracking-wide mb-8 uppercase">
          LOGIN FORM
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-lg font-serif text-gray-900 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
            />
          </div>

          <div>
            <label className="block text-lg font-serif text-gray-900 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#2b8242] hover:bg-green-700 text-white text-lg py-2.5 rounded transition font-medium shadow-sm"
          >
            Login
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

        <p className="mt-6 text-center text-base text-gray-900 font-serif">
          Don't have an account?{' '}
          <span 
            onClick={() => window.location.href = '/'} 
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
          >
            Register
          </span>
        </p>

      </div>
    </main>
  );




} 