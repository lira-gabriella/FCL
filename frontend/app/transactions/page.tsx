"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = '';

interface FurnitureItem {
 FurnitureId: number;
 FurnitureName: string;
 FurnitureOwnerName: string;
}

interface StockReportItem extends FurnitureItem {
 TotalImported: number;
 TotalExported: number;
 CurrentWarehouseStock: number;
}

export default function TransactionsPage() {
 const [furnitureOptions, setFurnitureOptions] = useState<StockReportItem[]>([]);
 const [stockReport, setStockReport] = useState<StockReportItem[]>([]);

 const [importForm, setImportForm] = useState({ furnitureId: '', quantity: '', date: '' });
 const [exportForm, setExportForm] = useState({ furnitureId: '', quantity: '', date: '' });

 const [loading, setLoading] = useState(true);
 const [errorMessage, setErrorMessage] = useState('');
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

 const getFurnitureLabel = (id: string): string => {
 const item = furnitureOptions.find(f => f.FurnitureId === parseInt(id));
 return item ? `${item.FurnitureName} — Owner: ${item.FurnitureOwnerName}` : '';
 };

 const refreshAllData = async () => {
 try {
 setLoading(true);
 const resOptions = await fetch(`${API_BASE_URL}/api/report/status`);
 if (!resOptions.ok) throw new Error("Could not fetch options.");
 const dataOptions: StockReportItem[] = await resOptions.json();
 setFurnitureOptions(dataOptions);

 setStockReport(dataOptions);

 setErrorMessage('');
 } catch (err: any) {
 console.error(err);
 setErrorMessage("FastAPI connection sync issue: Failed to fetch data.");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 refreshAllData();

 const todayStr = new Date().toISOString().split('T')[0];
 setImportForm(prev => ({ ...prev, date: todayStr }));
 setExportForm(prev => ({ ...prev, date: todayStr }));
 }, []);

 const handleImportSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!importForm.furnitureId || !importForm.quantity || !importForm.date) {
 return alert("Please fill out all fields for the import record.");
 }
 try {
 const res = await fetch(`${API_BASE_URL}/api/import`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 FurnitureId: parseInt(importForm.furnitureId),
 ImportDate: importForm.date,
 Quantity: parseInt(importForm.quantity)
 })
 });
 if (res.ok) {
 alert("Import logged successfully!");
 setImportForm(prev => ({ ...prev, furnitureId: '', quantity: '' }));
 await refreshAllData();
 } else {
 alert("Failed to submit import. Check server logs.");
 }
 } catch (err) {
 console.error(err);
 alert("Network communication error submitting transaction.");
 }
 };

 const handleExportSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!exportForm.furnitureId || !exportForm.quantity || !exportForm.date) {
 return alert("Please fill out all fields for the export record.");
 }
 try {
 const res = await fetch(`${API_BASE_URL}/api/export`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 FurnitureId: parseInt(exportForm.furnitureId),
 ExportDate: exportForm.date,
 Quantity: parseInt(exportForm.quantity)
 })
 });
 if (res.ok) {
 alert("Export logged successfully!");
 setExportForm(prev => ({ ...prev, furnitureId: '', quantity: '' }));
 await refreshAllData();
 } else {
 const errorData = await res.json();
 alert(errorData.detail ||"Failed to submit export.");
 }
 } catch (err) {
 console.error(err);
 alert("Network communication error submitting transaction.");
 }
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
 <i className="fas fa-tachometer-alt"></i>
 Dashboard Overview
 </Link>
 <button
 type="button"
 className="w-full flex items-center gap-3 px-4 py-4 bg-blue-600 text-white rounded-xl text-xl font-medium transition text-left"
 >
 <i className="fas fa-exchange-alt"></i>
 Transactions
 </button>
 <Link
 href="/report"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-chart-bar"></i>
 Report
 </Link>
 {userRole === 'admin' && (
 <Link
 href="/users"
 className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white hover:text-gray-800 text-gray-300 rounded-xl text-xl font-medium transition block"
 >
 <i className="fas fa-user-shield"></i>
 User Management
 </Link>
 )}
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
 <i className={`${userRole === 'admin' ? 'fas fa-user-shield text-purple-400' : 'fas fa-user-tie text-blue-400'} text-xl`}></i>
 <span className="text-lg font-medium">
 {userRole === 'admin' ? 'Admin' : 'Manager'} Access
  </span>
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
 {errorMessage && (
 <div className="text-lg bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium">
 {errorMessage}
 </div>
 )}
 </header>

 <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
 <div>
 <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
 <i className="fas fa-warehouse text-blue-600"></i>
 Warehouse Ledger Transactions
 </h1>
 <p className="text-gray-500 text-lg mt-2 flex items-center gap-2">
 <i className="fas fa-info-circle text-blue-400"></i>
 Record incoming and outgoing inventory operations below.
 </p>
 </div>

 {loading ? (
 <div className="text-center py-12 text-lg text-gray-500">Loading live furniture profiles...</div>
 ) : (
 <div className="space-y-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Log Stock Import */}
 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
 <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
 <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
 <i className="fas fa-truck-loading text-emerald-500"></i> Log Stock Import
 </h2>
 </div>
 <form onSubmit={handleImportSubmit} className="space-y-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Select Furniture Item Type
 </label>
 <select
 value={importForm.furnitureId}
 onChange={(e) => setImportForm(prev => ({ ...prev, furnitureId: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg bg-white focus:outline-none focus:border-emerald-400"
 aria-label="Select furniture item to import"
 >
 <option value="">-- Choose Item From Active Inventory --</option>
 {furnitureOptions.map((item) => (
 <option key={item.FurnitureId} value={String(item.FurnitureId)}>
 {item.FurnitureName} — Owner: {item.FurnitureOwnerName}
 </option>
 ))}
 </select>
 {importForm.furnitureId && (
 <div className="mt-1 text-lg text-gray-500">{getFurnitureLabel(importForm.furnitureId)}</div>
 )}
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Quantity (Units)
 </label>
 <input
 type="number"
 min="1"
 placeholder="0"
 value={importForm.quantity}
 onChange={(e) => setImportForm(prev => ({ ...prev, quantity: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:border-emerald-400"
 />
 </div>
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Import Date
 </label>
 <input
 type="date"
 value={importForm.date}
 onChange={(e) => setImportForm(prev => ({ ...prev, date: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:border-emerald-400"
 />
 </div>
 </div>
 <button
 type="submit"
 className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-lg rounded-lg transition shadow-sm"
 >
 Save Import
 </button>
 </form>
 </div>

 {/* Log Stock Export */}
 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
 <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
 <div className="h-2 w-2 rounded-full bg-purple-500"></div>
 <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
 <i className="fas fa-truck text-purple-500"></i> Log Stock Export
 </h2>
 </div>
 <form onSubmit={handleExportSubmit} className="space-y-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Select Furniture Item Type
 </label>
 <select
 value={exportForm.furnitureId}
 onChange={(e) => setExportForm(prev => ({ ...prev, furnitureId: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg bg-white focus:outline-none focus:border-blue-400"
 aria-label="Select furniture item to export"
 >
 <option value="">-- Choose Item From Active Inventory --</option>
 {furnitureOptions.map((item) => (
 <option key={item.FurnitureId} value={String(item.FurnitureId)}>
 {item.FurnitureName} — Owner: {item.FurnitureOwnerName}
 </option>
 ))}
 </select>
 {exportForm.furnitureId && (
 <div className="mt-1 text-lg text-gray-500">{getFurnitureLabel(exportForm.furnitureId)}</div>
 )}
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Quantity (Units)
 </label>
 <input
 type="number"
 min="1"
 placeholder="0"
 value={exportForm.quantity}
 onChange={(e) => setExportForm(prev => ({ ...prev, quantity: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-400"
 />
 </div>
 <div>
 <label className="block text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">
 Export Date
 </label>
 <input
 type="date"
 value={exportForm.date}
 onChange={(e) => setExportForm(prev => ({ ...prev, date: e.target.value }))}
 className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-400"
 />
 </div>
 </div>
 <button
 type="submit"
 className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium text-lg rounded-lg transition shadow-sm"
 >
 Save Export
 </button>
 </form>
 </div>
 </div>

 {/* Warehouse Stock Balance Table */}
 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
 <div className="bg-white px-6 py-4">
 <h2 className="text-xl font-bold text-white tracking-wide">Live Warehouse Stock Balance</h2>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-gray-100 border-b border-gray-200 text-lg font-bold text-gray-500 uppercase tracking-wider">
 <th className="px-6 py-3 w-20">ID</th>
 <th className="px-6 py-3">Furniture Item Name</th>
 <th className="px-6 py-3">Importer / Owner</th>
 <th className="px-6 py-3 text-center">Total Imported</th>
 <th className="px-6 py-3 text-center">Total Exported</th>
 <th className="px-6 py-3 text-right pr-6">Current Stock</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100 text-base">
 {stockReport.length === 0 ? (
 <tr>
 <td colSpan={6} className="px-6 py-4 text-center text-lg text-gray-500">
 No stock items found.
 </td>
 </tr>
 ) : (
 stockReport.map((item) => (
 <tr key={item.FurnitureId} className="hover:bg-gray-100">
 <td className="px-6 py-3">{item.FurnitureId}</td>
 <td className="px-6 py-3">{item.FurnitureName}</td>
 <td className="px-6 py-3">{item.FurnitureOwnerName}</td>
 <td className="px-6 py-3 text-center">{item.TotalImported}</td>
 <td className="px-6 py-3 text-center">{item.TotalExported}</td>
 <td className="px-6 py-3 text-right pr-6">{item.CurrentWarehouseStock}</td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}
 </main>
 </div>
 </div>
 );
}
