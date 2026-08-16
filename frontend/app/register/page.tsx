"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage(){

  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');
  const [email , setEmail] = useState('');
  const [telephone , setTelephone] = useState('');
  const [password , setPassword] = useState('');
  const [role , setRole] = useState('manager');
  const [statusMessage , setStatusMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      telephone: telephone,
      password: password,
      role: role
    };

    const response = await fetch('/api/register', {
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
    <main className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-serif">
      <div className="bg-[#f4f2f2] p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-300">
        <div className="flex items-center justify-center mb-6">
          <div className="relative mr-4">
            <i className="fas fa-warehouse text-5xl text-blue-600"></i>
            <i className="fas fa-box-open absolute -bottom-2 -right-2 text-2xl text-amber-500"></i>
          </div>
          <h2 className="text-4xl font-serif text-gray-900 tracking-wide uppercase">
            REGISTRATION FORM
          </h2>
        </div>

        <p className="text-center text-gray-600 text-sm mb-6">
          Create your account and start managing warehouse inventory
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xl font-serif text-gray-900 mb-1">
                <i className="fas fa-user mr-2 text-blue-500"></i>Firstname
              </label>
              <input 
                type="text" 
                placeholder="Enter your first name"
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg" 
              />
            </div>
            <div>
              <label className="block text-xl font-serif text-gray-900 mb-1">
                <i className="fas fa-user mr-2 text-blue-500"></i>Lastname
              </label>
              <input 
                type="text" 
                placeholder="Enter your last name"
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xl font-serif text-gray-900 mb-1">
                <i className="fas fa-envelope mr-2 text-blue-500"></i>Email
              </label>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg" 
              />
            </div>
            <div>
              <label className="block text-xl font-serif text-gray-900 mb-1">
                <i className="fas fa-phone mr-2 text-blue-500"></i>Telephone
              </label>
              <input 
                type="text" 
                placeholder="Enter your number"
                value={telephone} 
                onChange={(e) => setTelephone(e.target.value)} 
                required 
                className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg" 
              />
            </div>
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
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg" 
            />
          </div>

          <div>
            <label className="block text-xl font-serif text-gray-900 mb-1">
              <i className="fas fa-user-shield mr-2 text-blue-500"></i>Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:border-blue-500 font-serif text-lg"
            >
              <option value="manager">Manager — Warehouse operations</option>
              <option value="admin">Admin — Full system access</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-600"></i>
              Role Permissions
            </h3>
            <ul className="text-sm text-gray-700 font-serif space-y-1">
              <li><i className="fas fa-check mr-2 text-green-600"></i><strong>Manager</strong>: Add furniture, log imports/exports, view reports</li>
              <li><i className="fas fa-check mr-2 text-green-600"></i><strong>Admin</strong>: All manager permissions + manage users and system access</li>
            </ul>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1b73e8] hover:bg-blue-700 text-white text-xl py-3 rounded transition font-medium shadow-sm font-serif"
          >
            <i className="fas fa-user-plus mr-2"></i>Register
          </button>
        </form>

        {statusMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded text-center font-medium">
            {statusMessage}
          </div>
        )}

        <p className="mt-6 text-center text-lg text-gray-900 font-serif">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}
