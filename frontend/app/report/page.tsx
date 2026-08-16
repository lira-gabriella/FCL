"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = '';

interface ReportRow {
 FurnitureId: number;
 FurnitureName: string;
 FurnitureOwnerName: string;
 TotalImported: number;
 TotalExported: number;
 CurrentWarehouseStock: number;
}

export default function ReportPage() {
 const [reportData, setReportData] = useState<ReportRow[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [stockFilter, setStockFilter] = useState('all');
 const [userRole, setUserRole] = useState('');

 useEffect(() => {
 if (typeof window !== 'undefined') {
 const loggedIn = sessionStorage.getItem('isLoggedIn');
 const role = sessionStorage.getItem('userRole') || 'manager';
 if (!loggedIn) {
 window.location.href = '/login';
 } else {
 setUserRole(role);
 }
 }
 }, []);

 const fetchReportData = async () => {
 try {
 setLoading(true);
 const res = await fetch(`${API_BASE_URL}/api/report/status`);
 if (!res.ok) throw new Error("Could not fetch warehouse summary data.");
 const data = await res.json();
 setReportData(data);
 } catch (err) {
 console.error("Report Fetch Error:", err);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchReportData();
 }, []);

 
 const filteredRows = reportData.filter(item => {
 const matchesSearch = 
 item.FurnitureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
 item.FurnitureOwnerName.toLowerCase().includes(searchQuery.toLowerCase());

 if (!matchesSearch) return false;

 if (stockFilter === 'empty') return item.CurrentWarehouseStock === 0;
 if (stockFilter === 'low') return item.CurrentWarehouseStock > 0 && item.CurrentWarehouseStock <= 10;
 if (stockFilter === 'healthy') return item.CurrentWarehouseStock > 10;
 return true; // 'all'
 });

 // Calculate Cumulative Summary Totals for Headings
 const totalTypes = reportData.length;
 const grandImports = reportData.reduce((acc, row) => acc + row.TotalImported, 0);
 const grandExports = reportData.reduce((acc, row) => acc + row.TotalExported, 0);
 const currentNetStock = reportData.reduce((acc, row) => acc + row.CurrentWarehouseStock, 0);

 const handlePrint = () => {
 window.print();
 };

 return (
 <div className="flex min-h-screen bg-gray-50 font-serif print:bg-white text-gray-500">
 <aside className="w-72 bg-[#0a192f] text-gray-300 flex flex-col justify-between shrink-0 shadow-xl print:hidden">
 <div>
 <div className="p-6 text-white font-bold text-2xl tracking-wider border-b border-slate-800 flex items-center gap-2">
 <i className="fas fa-warehouse text-blue-400"></i>
 CARGO LTD
 </div>
 <nav className="p-4 pt-8 space-y-2">
 <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block">
 <i className="fas fa-tachometer-alt w-6"></i>
 Dashboard Overview
 </Link>
 <Link href="/transactions" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block">
 <i className="fas fa-exchange-alt w-6"></i>
 Transactions
 </Link>
 <Link href="/report" className="w-full flex items-center gap-3 px-4 py-4 bg-blue-600 text-white rounded-xl text-xl font-medium transition">
 <i className="fas fa-chart-bar w-6"></i>
 Active Stock Report
 </Link>
 {userRole === 'admin' && (
 <Link href="/users" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block">
 <i className="fas fa-user-shield w-6"></i>
 User Management
 </Link>
 )}
 <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block">
 <i className="fas fa-cog w-6"></i>
 Settings
 </Link>
 <Link href="/help" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block">
 <i className="fas fa-life-ring w-6"></i>
 Help & Support
 </Link>
 </nav>
 </div>
 <div className="p-6 border-t border-gray-200 flex items-center gap-3">
 <i className={`${userRole === 'admin' ? 'fas fa-user-shield text-purple-400' : 'fas fa-user-tie text-blue-400'} text-xl`}></i>
 <span className="text-lg font-medium">
 {userRole === 'admin' ? 'Admin' : 'Manager'} Access
 </span>
 </div>
 </aside>

 
 <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
 
 <header className="px-8 py-6 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm print:hidden">
 <div className="text-lg font-medium text-gray-500">
 System Status: <span className="text-emerald-600 font-bold">● Live Operational</span>
 </div>
 <div className="flex items-center gap-4">
 <button 
 onClick={handlePrint}
 className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-xl text-lg font-bold transition flex items-center gap-2 shadow-sm"
 >
 <i className="fas fa-print"></i> Export PDF / Print
 </button>
 </div>
 </header>

 <main className="p-8 mx-auto w-full max-w-[1400px] space-y-8 print:p-0">
 
 
 <div className="flex justify-between items-start border-b border-gray-200 pb-4">
 <div>
 <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
 <i className="fas fa-file-export text-blue-600"></i>
 Warehouse Audit Ledger Report
 </h1>
 <p className="text-gray-500 text-lg mt-1 flex items-center gap-2">
 <i className="fas fa-info-circle text-blue-400"></i>
 Comprehensive list detailing real-time active inventory balance, imports, and logs.
 </p>
 </div>
 <div className="text-right text-lg text-gray-500 font-mono">
 <p>Generated: {new Date().toLocaleDateString()}</p>
 <p>Scope: Active Stocks Only</p>
 </div>
 </div>

 
 <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
 <p className="text-lg font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
 <i className="fas fa-cube text-gray-500"></i> Monitored Profiles
 </p>
 </div>
 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
 <p className="text-lg font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
 <i className="fas fa-truck-loading text-emerald-500"></i> Total Volume Imported
 </p>
 <h3 className="text-3xl font-black mt-1 text-emerald-600">+{grandImports} Units</h3>
 </div>
 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
 <p className="text-lg font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
 <i className="fas fa-truck text-amber-500"></i> Total Volume Exported
 </p>
 <h3 className="text-3xl font-black mt-1 text-amber-600">-{grandExports} Units</h3>
 </div>
 <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
 <p className="text-lg font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
 <i className="fas fa-warehouse text-blue-500"></i> Net Current Balance
 </p>
 <h3 className="text-3xl font-black mt-1 text-blue-600">{currentNetStock} Available</h3>
 </div>
 </section>

 
 <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
 <div className="w-full md:w-96">
 <input
 type="text"
 placeholder="Filter by keyword (Item name, business owner...)"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full text-lg p-3 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-400 bg-gray-50"
 />
 </div>
 <div className="flex gap-2 w-full md:w-auto">
 {['all', 'healthy', 'low', 'empty'].map((filterType) => (
 <button
 key={filterType}
 onClick={() => setStockFilter(filterType)}
 className={`text-lg px-5 py-3 rounded-xl font-bold capitalize transition ${
 stockFilter === filterType 
 ? 'bg-blue-600 text-white shadow-sm' 
 : 'bg-gray-50 text-gray-500 hover:bg-gray-200 :bg-gray-700 :bg-gray-700'
 }`}
 >
 {filterType === 'all' ? 'Show All Stocks' : `${filterType} Stock`}
 </button>
 ))}
 </div>
 </section>

 <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden print:border-gray-300">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-700 text-white text-lg font-bold uppercase tracking-wider">
 <th className="p-4 w-24">Item ID</th>
 <th className="p-4">Furniture Type Description</th>
 <th className="p-4">Assigned Trader / Client</th>
 <th className="p-4 text-center w-36">Total Imported</th>
 <th className="p-4 text-center w-36">Total Exported</th>
 <th className="p-4 text-center w-36">Warehouse Stock</th>
 <th className="p-4 text-center w-36">Stock Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-lg">
 {loading ? (
 <tr>
 <td colSpan={7} className="px-6 py-12 text-center text-xl text-gray-500 animate-pulse">Running server analytical query...</td>
 </tr>
 ) : filteredRows.length === 0 ? (
 <tr>
 <td colSpan={7} className="px-6 py-12 text-center text-xl text-gray-500 italic">No report profiles matched your query parameters.</td>
 </tr>
 ) : (
 filteredRows.map((row) => {
 let statusLabel ="Healthy Balance";
 let statusColor ="bg-emerald-50 text-emerald-700 border-emerald-200";

 if (row.CurrentWarehouseStock === 0) {
 statusLabel ="Out of Stock";
 statusColor ="bg-red-50 text-red-700 border-red-200";
 } else if (row.CurrentWarehouseStock <= 10) {
 statusLabel ="Low Stock Hazard";
 statusColor ="bg-amber-50 text-amber-700 border-amber-200";
 }

 return (
 <tr key={row.FurnitureId} className="hover:bg-gray-200 :bg-gray-700 :bg-gray-700">
 <td className="px-4 py-3">{row.FurnitureId}</td>
 <td className="px-6 py-4 text-lg">{row.FurnitureName}</td>
 <td className="px-6 py-4 text-lg">{row.FurnitureOwnerName}</td>
 <td className="px-6 py-4 text-center text-lg">{row.TotalImported}</td>
 <td className="px-6 py-4 text-center text-lg">{row.TotalExported}</td>
 <td className="px-6 py-4 text-center text-lg">{row.CurrentWarehouseStock}</td>
 <td className={`px-4 py-3 text-center border rounded ${statusColor}`}>
 <span
 className="block px-2 py-1 text-lg font-semibold rounded"
 style={{
 backgroundColor: statusColor.includes('red') ? '#f87171' :
 statusColor.includes('amber') ? '#facc15' :
 '#34d399',
 color: statusColor.includes('red') ? '#b91c1c' :
 statusColor.includes('amber') ? '#92400e' :
 '#065f46'
 }}
 >
 {statusLabel}
 </span>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </section>
 </main>
 </div>
 </div>
 );
}