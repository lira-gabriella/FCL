"use client";

import { useState } from "react";

export default function RegisterPage(){

  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');
  const [email , setEmail] = useState('');
  const [telephone , setTelephone] = useState('');
  const [password , setPassword] = useState('');
  const [statusMessage , setStatusMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      telephone: telephone,
      password: password
    };

  
const response = await fetch('http://127.0.0.1:8000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dataToSend)
});
    const result = await response.json();
    setStatusMessage(result.message);

    setTimeout(() => {
      window.location.href = '/login';
    }, 2000); 

  };
 
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-[#f4f2f2] p-8 rounded shadow-xl w-full max-w-2xl border border-gray-300">
        <h2 className="text-3xl font-serif text-center text-gray-900 tracking-wide mb-8 uppercase">
          REGISTRATION FORM
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          
     
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-lg font-serif text-gray-900 mb-1">Firstname</label>
              <input 
                type="text" 
                placeholder="Enter your first name"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-lg font-serif text-gray-900 mb-1">Lastname</label>
              <input 
                type="text" 
                placeholder="Enter your first lastname"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-lg font-serif text-gray-900 mb-1">email</label>
              <input 
                type="email" 
                placeholder="Enter your first email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-lg font-serif text-gray-900 mb-1">telephone</label>
              <input 
                type="text" 
                placeholder="Enter your number"
                value={telephone} 
                onChange={(e) => setTelephone(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500" 
              />
            </div>
          </div>

       
          <div>
            <label className="block text-lg font-serif text-gray-900 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500" 
            />
          </div>

      
          <button 
            type="submit" 
            className="w-full bg-[#1b73e8] text-white text-lg py-2.5 rounded hover:bg-blue-700 transition font-medium shadow-sm"
          >
            Register
          </button>
        </form>

        {statusMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded text-center font-medium">
            {statusMessage}
          </div>
        )}

        <p className="mt-6 text-center text-lg text-gray-900 font-serif">
          Already have an account?{' '}
          <span 
            onClick={() => window.location.href = '/login'} 
            className="text-blue-600 underline cursor-pointer hover:text-blue-800"
          >
            Login
          </span>
        </p>

      </div>
    </main>
  );
}
