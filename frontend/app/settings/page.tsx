"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
 const [userRole, setUserRole] = useState('');
 const [firstName, setFirstName] = useState('');

 useEffect(() => {
 if (typeof window !== 'undefined') {
 const loggedIn = sessionStorage.getItem('isLoggedIn');
 const role = sessionStorage.getItem('userRole') || 'manager';
 const name = sessionStorage.getItem('userFirstName') || '';
 if (!loggedIn) {
 window.location.href = '/login';
 } else {
 setUserRole(role);
 setFirstName(name);
 }
 }
 }, []);

 const getRoleIcon = (role: string) => {
 if (role === 'admin') return 'fas fa-user-shield text-purple-400';
 return 'fas fa-user-tie text-blue-400';
 };

 const getRoleLabel = (role: string) => {
 if (role === 'admin') return 'Admin';
 return 'Manager';
 };

 return (
 <div className="flex min-h-screen bg-gray-50 font-serif text-gray-800">
 <aside className="w-72 bg-[#0a192f] text-white flex flex-col justify-between shrink-0 shadow-xl">
 <div>
 <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
 <i className="fas fa-warehouse text-3xl text-blue-400"></i>
 <span className="text-2xl font-bold tracking-wider uppercase">CARGO Ltd</span>
 </div>

 <nav className="p-4 pt-8 space-y-2">
 <Link href="/dashboard" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-tachometer-alt w-6"></i>
 <span>Dashboard Overview</span>
 </Link>
 <Link href="/transactions" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-exchange-alt w-6"></i>
 <span>Transactions</span>
 </Link>
 <Link href="/report" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-chart-bar w-6"></i>
 <span>Report</span>
 </Link>
 {userRole === 'admin' && (
 <Link href="/users" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-user-shield w-6"></i>
 <span>User Management</span>
 </Link>
 )}
 <Link href="/settings" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-blue-600 font-bold text-xl text-white transition text-left">
 <i className="fas fa-cog w-6"></i>
 <span>Settings</span>
 </Link>
 <Link href="/help" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-life-ring w-6"></i>
 <span>Help & Support</span>
 </Link>
 </nav>
 </div>
 <div className="p-6 border-t border-gray-200 flex items-center gap-3">
 <i className={`${getRoleIcon(userRole)} text-xl`}></i>
 <span className="text-lg font-medium">
 {getRoleLabel(userRole)} Access
 </span>
 </div>
 </aside>

 <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
 <header className="bg-white h-20 px-8 border-b border-gray-200 flex items-center justify-between shadow-sm">
 <div className="text-lg text-gray-500 font-medium flex items-center gap-4">
 <span className="flex items-center gap-2">
 <span className="text-green-600 font-bold">● Live Operational</span>
 <span>System Status:</span>
 </span>
 </div>
 <div className="flex items-center gap-6">
 <span className="text-xl font-semibold text-slate-700">
 {firstName} ({getRoleLabel(userRole)})
 </span>
 <button
 onClick={() => {
 sessionStorage.removeItem('isLoggedIn');
 sessionStorage.removeItem('userFirstName');
 sessionStorage.removeItem('userRole');
 window.location.href = '/login';
 }}
 className="px-6 py-3 text-lg font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition flex items-center gap-2"
 >
 <i className="fas fa-sign-out-alt"></i>
 Logout
 </button>
 </div>
 </header>

 <main className="flex-1 p-10 mx-auto w-full max-w-[1400px] space-y-8">
 <div>
 <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
 <i className="fas fa-cog text-blue-600"></i>
 System Settings
 </h1>
 <p className="text-xl text-gray-500 font-serif">
 Configure your CARGO warehouse management system preferences
 </p>
 </div>

 <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
 <i className="fas fa-desktop text-blue-600"></i>
 Appearance
 </h2>
 <div className="space-y-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Theme
 </label>
 <div className="flex gap-4">
 <label className="flex items-center gap-2 text-lg cursor-pointer">
 <input type="radio"name="theme"defaultChecked className="form-radio h-5 w-5 text-blue-600"/>
 <span>Dark</span>
 </label>
 <label className="flex items-center gap-2 text-lg cursor-pointer">
 <input type="radio"name="theme=" className="form-radio h-5 w-5 text-blue-600"/>
 <span>Light</span>
 </label>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
 <i className="fas fa-server text-blue-600"></i>
 System Configuration
 </h2>
 <div className="space-y-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Auto-save Interval
 </label>
 <select className="w-full text-lg p-3 border border-gray-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-blue-400">
 <option>5 minutes</option>
 <option>10 minutes</option>
 <option>30 minutes</option>
 <option>1 hour</option>
 </select>
 </div>
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Notification Level
 </label>
 <select className="w-full text-lg p-3 border border-gray-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-blue-400">
 <option>All Alerts</option>
 <option>Important Only</option>
 <option>None</option>
 </select>
 </div>
 </div>
 </div>

 <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
 <i className="fas fa-database text-blue-600"></i>
 Database & Backup
 </h2>
 <div className="flex flex-col md:flex-row gap-6">
 <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition flex items-center justify-center gap-3">
 <i className="fas fa-download"></i> Download Backup
 </button>
 <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-xl transition flex items-center justify-center gap-3">
 <i className="fas fa-upload"></i> Restore from Backup
 </button>
 <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-bold rounded-xl transition flex items-center justify-center gap-3">
 <i className="fas fa-trash-alt"></i> Clear Logs
 </button>
 </div>
 <p className="text-lg text-gray-500 mt-4">
 Last backup: Never — Backups are manual in the development environment.
 </p>
 </div>
 </section>
 </main>
 </div>
 </div>
 );
}
