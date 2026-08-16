"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HelpPage() {
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

 const faqs = [
 {
 q:"How do I register a new furniture type?",
 a:"Navigate to the Dashboard, fill in the Furniture Item Name and Business Owner Name fields, then click 'Save Type'. The item will immediately appear in your inventory."
 },
 {
 q:"How do I log an import or export transaction?",
 a:"Go to the Transactions page from the sidebar. Select the furniture type from the dropdown, enter the quantity and date, then click 'Save Import' or 'Save Export'. The warehouse stock updates automatically."
 },
 {
 q:"What do the stock status colors mean?",
 a:"Green = Healthy Balance (in stock), Amber = Low Stock Hazard (running low), Red = Out of Stock (needs reorder). Check the Report page for color-coded inventory view."
 },
 {
 q:"How do I generate a printable report?",
 a:"On the Report page, click the 'Export PDF / Print' button in the top-right corner. The full audit report will be formatted for printing."
 },
 {
 q:"How do I manage user accounts?",
 a:"Admin users can go to User Management in the sidebar (under their role access). There you can view all registered users, their emails, and roles."
 },
 {
 q:"What is the difference between Manager and Admin roles?",
 a:"Managers can view dashboard, transactions, and reports. Admins have full access including User Management where they can create and manage manager accounts."
 },
 ];

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
 <Link href="/settings" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-300 hover:bg-slate-700 hover:text-white transition text-left text-xl">
 <i className="fas fa-cog w-6"></i>
 <span>Settings</span>
 </Link>
 <Link href="/help" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-blue-600 font-bold text-xl text-white transition text-left">
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
 <i className="fas fa-life-ring text-blue-600"></i>
 Help & Support Center
 </h1>
 <p className="text-xl text-gray-500 font-serif">
 Frequently asked questions and troubleshooting for the CARGO system
 </p>
 </div>

 <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition">
 <i className="fas fa-headset text-4xl text-blue-600 mb-3"></i>
 <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Live Support</h3>
 <p className="text-lg text-gray-500">
 Contact our support team anytime for urgent issues
 </p>
 <button className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition flex items-center justify-center gap-2 w-full">
 <i className="fas fa-phone"></i> Call Now
 </button>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition">
 <i className="fas fa-book text-4xl text-emerald-600 mb-3"></i>
 <h3 className="text-xl font-bold text-gray-800 mb-2">Documentation</h3>
 <p className="text-lg text-gray-500">
 Read the full CARGO system user guide and API reference
 </p>
 <button className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg transition flex items-center justify-center gap-2 w-full">
 <i className="fas fa-book-open"></i> Read Docs
 </button>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:shadow-md transition">
 <i className="fas fa-bug text-4xl text-amber-600 mb-3"></i>
 <h3 className="text-xl font-bold text-gray-800 mb-2">Report a Bug</h3>
 <p className="text-lg text-gray-500">
 Found something broken? Let us know and we'll fix it
 </p>
 <button className="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-lg transition flex items-center justify-center gap-2 w-full">
 <i className="fas fa-bug"></i> Submit Report
 </button>
 </div>
 </section>

 <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
 <div className="bg-white px-6 py-4">
 <h2 className="text-xl font-bold text-white flex items-center gap-2">
 <i className="fas fa-question-circle"></i>
 Frequently Asked Questions
 </h2>
 </div>
 <div className="p-6 space-y-4">
 {faqs.map((faq, idx) => (
 <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition">
 <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-start gap-3">
 <i className="fas fa-angle-right text-blue-600 mt-0.5"></i>
 {faq.q}
 </h3>
 <p className="text-lg text-gray-500 leading-relaxed ml-9">
 {faq.a}
 </p>
 </div>
 ))}
 </div>
 </section>
 </main>
 </div>
 </div>
 );
}
