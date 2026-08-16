'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
 const [furnitureList, setFurnitureList] = useState<any[]>([]);
 const [furnitureName, setFurnitureName] = useState('');
 const [furnitureOwnerName, setFurnitureOwnerName] = useState('');
 const [loading, setLoading] = useState<boolean>(true);
 const [firstName, setFirstName] = useState('');
 const [userRole, setUserRole] = useState('');

 useEffect(() => {
 if (typeof window !== 'undefined') {
 const loggedIn = sessionStorage.getItem('isLoggedIn');
 const name = sessionStorage.getItem('userFirstName') || '';
 const role = sessionStorage.getItem('userRole') || 'manager';
 if (!loggedIn) {
 window.location.href = '/login';
 } else {
 setFirstName(name);
 setUserRole(role);
 }
 }
 }, []);

 const handleLogout = () => {
 sessionStorage.removeItem('isLoggedIn');
 sessionStorage.removeItem('userFirstName');
 sessionStorage.removeItem('userRole');
 window.location.href = '/login';
 };

 const fetchDashboardData = async () => {
 try {
 const response = await fetch('/api/report/status');
 const data = await response.json();

 if (Array.isArray(data)) {
 setFurnitureList(data);
 }
 } catch (error) {
 console.error('Dashboard Error:', error);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchDashboardData();
 }, []);

 const handleAddFurniture = async (e: React.FormEvent) => {
 e.preventDefault();
 const itemData = {
 FurnitureName: furnitureName,
 FurnitureOwnerName: furnitureOwnerName
 };

 try {
 const response = await fetch('/api/furniture', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Accept': 'application/json', 
 },
 body: JSON.stringify(itemData),
 });
 if (response.ok) {
 setFurnitureName('');
 setFurnitureOwnerName('');
 await fetchDashboardData();
 } else {
 console.error("Server rejected the data:", await response.text());
 }
 } catch (error) {
 console.error("Failed to add the furniture:", error);
 }
 };

 const handleDeleteFurniture = async (id: number) => {
 if (!confirm("Are you sure you want to delete this furniture item? This will remove all logs.")) return;
 try {
 await fetch(`/api/furniture/${id}`, {
 method: 'DELETE',
 });
 fetchDashboardData();
 } catch (error) {
 console.error("Delete Error:", error);
 }
 };

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
 <Link href="/dashboard" className="w-full flex items-center space-x-3 px-4 py-4 rounded-xl bg-blue-600 font-bold text-xl text-white transition text-left">
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
 <div className="flex items-center gap-3">
 <i className={`${getRoleIcon(userRole)} text-xl`}></i>
 <span className="text-xl font-semibold text-slate-700">
 {firstName} ({getRoleLabel(userRole)})
 </span>
 </div>
 <button
 onClick={handleLogout}
 className="px-6 py-3 text-lg font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition flex items-center gap-2"
 >
 <i className="fas fa-sign-out-alt"></i>
 Logout
 </button>
 </div>
 </header>

 <main className="flex-1 p-8 mx-auto w-full max-w-[1400px] space-y-8">
 <div>
 <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
 <i className="fas fa-tachometer-alt text-blue-600"></i>
 Dashboard Overview
 </h1>
 <p className="text-gray-500 text-lg">
 <i className="fas fa-info-circle mr-2 text-blue-400"></i>
 Real-time warehouse inventory status and metrics
 </p>
 </div>

 <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
 <p className="text-lg font-bold text-gray-500 uppercase flex items-center gap-2">
 <i className="fas fa-cube text-blue-400"></i> Furniture Types
 </p>
 <h3 className="text-5xl font-black mt-3 text-gray-800">{furnitureList.length}</h3>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
 <p className="text-lg font-bold text-gray-500 uppercase flex items-center gap-2">
 <i className="fas fa-truck-loading text-green-400"></i> Imports Logged
 </p>
 <h3 className="text-5xl font-black mt-3 text-green-600">
 {furnitureList.reduce((sum, item) => sum + (item.TotalImported || 0), 0)}
 </h3>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
 <p className="text-lg font-bold text-gray-500 uppercase flex items-center gap-2">
 <i className="fas fa-truck text-red-400"></i> Exports Logged
 </p>
 <h3 className="text-5xl font-black mt-3 text-red-600">
 {furnitureList.reduce((sum, item) => sum + (item.TotalExported || 0), 0)}
 </h3>
 </div>
 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
 <p className="text-lg font-bold text-gray-500 uppercase flex items-center gap-2">
 <i className="fas fa-warehouse text-blue-400"></i> Net Stock Balance
 </p>
 <h3 className="text-5xl font-black mt-3 text-blue-600">
 {furnitureList.reduce((sum, item) => sum + (item.CurrentWarehouseStock || 0), 0)}
 </h3>
 </div>
 </section>

 <section className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
 <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-2">
 <i className="fas fa-plus-circle text-blue-600"></i>
 Register New Furniture Type
 </h2>
 <form onSubmit={handleAddFurniture} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
 <i className="fas fa-tag text-blue-400"></i> Furniture Item Name
 </label>
 <input
 type="text"
 placeholder="e.g. Office Chair"
 value={furnitureName}
 onChange={(e) => setFurnitureName(e.target.value)}
 required
 className="w-full p-3 border border-gray-300 rounded-xl text-lg text-slate-900 bg-white focus:outline-none focus:border-blue-400"
 />
 </div>
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
 <i className="fas fa-user-tie text-blue-400"></i> Business Owner Name
 </label>
 <input
 type="text"
 placeholder="e.g. Kigali Traders"
 value={furnitureOwnerName}
 onChange={(e) => setFurnitureOwnerName(e.target.value)}
 required
 className="w-full p-3 border border-gray-300 rounded-xl text-lg text-slate-900 bg-white focus:outline-none focus:border-blue-400"
 />
 </div>
 <div className="md:col-span-2 flex items-end">
  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-lg transition flex items-center gap-2">
 <i className="fas fa-save"></i> Save Type
 </button>
 </div>
 </form>
 </section>

 <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
 <div className="bg-white p-6 font-bold text-xl text-white flex items-center gap-3">
 <i className="fas fa-boxes"></i> Active Registered Warehouse Item Types
 </div>
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-100 border-b border-gray-200 text-lg font-bold text-gray-500 uppercase">
 <th className="p-6 w-24"><i className="fas fa-hashtag"></i> ID</th>
 <th className="p-6"><i className="fas fa-cube"></i> Furniture Type Name</th>
 <th className="p-6"><i className="fas fa-user-tie"></i> Importer / Owner</th>
 <th className="p-6 text-center w-40"><i className="fas fa-truck-loading"></i> Total Imported</th>
 <th className="p-6 text-center w-40"><i className="fas fa-truck"></i> Total Exported</th>
 <th className="p-6 text-center w-40"><i className="fas fa-warehouse"></i> Current Stock</th>
 <th className="p-6 text-center w-24">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-base">
 {loading ? (
 <tr>
 <td colSpan={7} className="px-6 py-8 text-center text-lg text-gray-500 animate-pulse">Loading secure tracking streams...</td>
 </tr>
 ) : furnitureList.length === 0 ? (
 <tr>
 <td colSpan={7} className="px-6 py-8 text-center text-lg text-gray-500 italic">No stock items found.</td>
 </tr>
 ) : (
 furnitureList.map((item) => (
 <tr key={item.FurnitureId} className="hover:bg-gray-100 transition-colors">
 <td className="p-6 font-mono text-lg text-gray-500">#{item.FurnitureId}</td>
 <td className="p-6 font-bold text-gray-800 text-lg">{item.FurnitureName}</td>
 <td className="p-6 text-gray-500 text-lg">{item.FurnitureOwnerName}</td>
 <td className="p-6 text-center font-mono text-emerald-600 font-bold text-lg">{item.TotalImported}</td>
 <td className="p-6 text-center font-mono text-amber-600 font-bold text-lg">{item.TotalExported}</td>
 <td className="p-6 text-center font-mono text-blue-600 font-black text-lg">{item.CurrentWarehouseStock}</td>
 <td className="p-6 text-center">
 <button 
 onClick={() => handleDeleteFurniture(item.FurnitureId)} 
 className="text-red-600 font-bold hover:text-red-800 hover:underline transition-all text-lg"
 >
 <i className="fas fa-trash-alt mr-1"></i> Delete
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </section>
 </main>
 </div>
 </div>
 );
}
