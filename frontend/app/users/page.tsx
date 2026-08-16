"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = '';

interface Manager {
 ManagerId: number;
 firstName: string;
 lastName: string;
 email: string;
 telephone: string;
 role: string;
}

export default function UsersPage() {
 const [managers, setManagers] = useState<Manager[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [userRole, setUserRole] = useState('');

 useEffect(() => {
 if (typeof window !== 'undefined') {
 const loggedIn = sessionStorage.getItem('isLoggedIn');
 const role = sessionStorage.getItem('userRole') || 'manager';
 if (!loggedIn || role !== 'admin') {
 window.location.href = '/login';
 } else {
 setUserRole(role);
 }
 }
 }, []);

 useEffect(() => {
 fetchManagers();
 }, []);

 const fetchManagers = async () => {
 try {
 setLoading(true);
 const res = await fetch(`${API_BASE_URL}/api/managers`);
 if (!res.ok) throw new Error("Could not fetch managers.");
 const data: Manager[] = await res.json();
 setManagers(data);
 } catch (err) {
 console.error(err);
 setError("Failed to load user accounts.");
 } finally {
 setLoading(false);
 }
 };

 const handleLogout = () => {
 sessionStorage.removeItem('isLoggedIn');
 sessionStorage.removeItem('userFirstName');
 sessionStorage.removeItem('userRole');
 window.location.href = '/login';
 };

 const getRoleBadge = (role: string) => {
 if (role === 'admin') {
 return (
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-bold bg-purple-100 text-purple-800">
 <i className="fas fa-crown mr-1"></i> Admin
 </span>
 );
 }
 return (
 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-bold bg-blue-100 text-blue-800">
 <i className="fas fa-user-tie mr-1"></i> Manager
 </span>
 );
 };

 return (
 <div className="flex h-screen bg-gray-50 font-serif text-gray-500">
 <aside className="w-72 bg-[#0a192f] text-white flex flex-col justify-between shrink-0 shadow-xl">
 <div>
 <div className="p-6 text-white font-bold text-2xl tracking-wider border-b border-gray-800 flex items-center gap-2">
 <i className="fas fa-warehouse text-blue-400"></i>
 CARGO LTD
 </div>
 <nav className="p-4 pt-8 space-y-2">
 <Link
 href="/dashboard"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-tachometer-alt w-6"></i>
 Dashboard Overview
 </Link>
 <Link
 href="/transactions"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-exchange-alt w-6"></i>
 Transactions
 </Link>
 <Link
 href="/report"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-chart-bar w-6"></i>
 Report
 </Link>
 <Link
 href="/users"
 className="w-full flex items-center gap-3 px-4 py-4 bg-blue-600 text-white rounded-xl text-xl font-medium transition text-left"
 >
 <i className="fas fa-user-shield w-6"></i>
 User Management
 </Link>
 <Link
 href="/settings"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-cog"></i>
 Settings
 </Link>
 <Link
 href="/help"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-life-ring"></i>
 Help & Support
 </Link>
 </nav>
 </div>
 <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3">
 <i className="fas fa-user-shield text-purple-400 text-xl"></i>
  <span className="text-lg font-medium">Admin Access</span>
  </div>
  </aside>

  <div className="flex-1 flex flex-col overflow-y-auto">
 <header className="px-8 py-6 bg-white border-b border-gray-200 flex items-center justify-between">
 <div className="flex items-center gap-2 text-lg font-medium text-gray-500">
 System Status:
 <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
 <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
 Live Operational
 </span>
 </div>
 <div className="flex items-center gap-4">
 <span className="text-xl font-semibold text-slate-700">
 {typeof window !== 'undefined' ? sessionStorage.getItem('userFirstName') : ''}
 </span>
 <button
 onClick={handleLogout}
 className="px-6 py-3 text-lg font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition flex items-center gap-2"
 >
 <i className="fas fa-sign-out-alt mr-1"></i> Logout
 </button>
 </div>
 </header>

 <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
 <div>
 <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
 <i className="fas fa-user-shield text-blue-600"></i>
 User Management
 </h1>
 <p className="text-gray-500 text-lg mt-1">
 <i className="fas fa-info-circle mr-1"></i>
 Manage system users and their access roles
 </p>
 </div>

 {error && (
 <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
 {error}
 </div>
 )}

 {loading ? (
 <div className="text-center py-12 text-lg text-gray-500">
 <i className="fas fa-spinner fa-pulse mr-2"></i>
 Loading user accounts...
 </div>
 ) : (
 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
 <div className="bg-white px-6 py-4 flex items-center gap-2">
 <i className="fas fa-users text-white"></i>
 <h2 className="text-xl font-bold text-white uppercase">Registered Users</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-100 border-b border-gray-200 text-lg font-bold text-gray-500 uppercase tracking-wider">
 <th className="px-6 py-4">ID</th>
 <th className="px-6 py-4">Name</th>
 <th className="px-6 py-4">Email</th>
 <th className="px-6 py-4">Telephone</th>
 <th className="px-6 py-4">Role</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-lg">
 {managers.map((m) => (
 <tr key={m.ManagerId} className="hover:bg-gray-100">
 <td className="px-6 py-4 font-mono text-lg text-gray-500">#{m.ManagerId}</td>
 <td className="px-6 py-4 font-medium text-gray-800 text-lg">
 {m.firstName} {m.lastName}
 </td>
 <td className="px-6 py-4 text-gray-500 text-lg">{m.email}</td>
 <td className="px-6 py-4 text-gray-500 text-lg">{m.telephone}</td>
 <td className="px-6 py-4 text-lg">{getRoleBadge(m.role)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </main>
 </div>
 </div>
 );
}
