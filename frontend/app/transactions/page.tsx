"use client";

import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface FurnitureItem {
  FurnitureId: number;
  FurnitureName: string;
  FurnitureOwnerName: string;
}

export default function TransactionsPage() {
  const [furnitureOptions, setFurnitureOptions] = useState<FurnitureItem[]>([]);

  // Form Input States
  const [importForm, setImportForm] = useState({ furnitureId: '', quantity: '', date: '' });
  const [exportForm, setExportForm] = useState({ furnitureId: '', quantity: '', date: '' });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadFurnitureOptions();

    const todayStr = new Date().toISOString().split('T')[0];
    setImportForm(prev => ({ ...prev, date: todayStr }));
    setExportForm(prev => ({ ...prev, date: todayStr }));
  }, []);

  // Fetch registered items from backend database to link with forms
  const loadFurnitureOptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/furniture`);
      if (!res.ok) throw new Error("Could not connect to storage backend API server.");
      const data = await res.json();
      setFurnitureOptions(data);
      setErrorMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage("FastAPI connection sync issue: Failed to fetch active furniture items.");
    } finally {
      setLoading(false);
    }
  };

  const getFurnitureLabel = (id: string) => {
    const found = furnitureOptions.find(f => String(f.FurnitureId) === id);
    return found ? `${found.FurnitureName} (Owner: ${found.FurnitureOwnerName})` : '';
  };

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
        loadFurnitureOptions(); // <-- refresh data
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
        loadFurnitureOptions(); // <-- refresh data
      } else {
        alert("Failed to submit export. Check server logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Network communication error submitting transaction.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <div className="w-64 bg-slate-900 text-slate-400 flex flex-col justify-between">
        <div>
          <div className="p-6 text-white font-bold text-lg tracking-wider border-b border-slate-800">
            CARGO LTD
          </div>
          <nav className="p-4 space-y-2">
            <a href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-400 rounded-lg text-sm font-medium transition block">
              Dashboard Overview
            </a>
            <button type="button" className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium transition text-left">
              Transactions
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Status Banner */}
        <header className="px-8 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            System Status: 
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Operational
            </span>
          </div>
          {errorMessage && (
            <div className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-medium">
              {errorMessage}
            </div>
          )}
        </header>

        <main className="p-8 space-y-8 max-w-7xl w-full mx-auto">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Warehouse Ledger Transactions</h1>
            <p className="text-gray-500 text-xs">Record incoming and outgoing inventory operations below.</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-sm text-gray-400">Loading live furniture profiles...</div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Log Stock Import */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <h2 className="text-base font-bold text-slate-800">Log Stock Import</h2>
                  </div>
                  <form onSubmit={handleImportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Select Furniture Item Type</label>
                      <select
                        value={importForm.furnitureId}
                        onChange={(e) => setImportForm(prev => ({ ...prev, furnitureId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-500"
                        aria-label="Select furniture item to import"
                      >
                        <option value="">-- Choose Item From Active Inventory --</option>
                        {furnitureOptions.map(item => (
                          <option key={item.FurnitureId} value={String(item.FurnitureId)}>
                            {item.FurnitureName} — Owner: {item.FurnitureOwnerName}
                          </option>
                        ))}
                      </select>
                      {importForm.furnitureId && (
                        <div className="mt-1 text-xs text-slate-500">{getFurnitureLabel(importForm.furnitureId)}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Quantity (Units)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="0"
                          value={importForm.quantity}
                          onChange={(e) => setImportForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Import Date</label>
                        <input
                          type="date"
                          value={importForm.date}
                          onChange={(e) => setImportForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
                    >
                      save Import
                    </button>
                  </form>
                </div>

                {/* Log Stock Export */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <h2 className="text-base font-bold text-slate-800">Log Stock Export</h2>
                  </div>
                  <form onSubmit={handleExportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Select Furniture Item Type</label>
                      <select
                        value={exportForm.furnitureId}
                        onChange={(e) => setExportForm(prev => ({ ...prev, furnitureId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                        aria-label="Select furniture item to export"
                      >
                        <option value="">-- Choose Item From Active Inventory --</option>
                        {furnitureOptions.map(item => (
                          <option key={item.FurnitureId} value={String(item.FurnitureId)}>
                            {item.FurnitureName} — Owner: {item.FurnitureOwnerName}
                          </option>
                        ))}
                      </select>
                      {exportForm.furnitureId && (
                        <div className="mt-1 text-xs text-slate-500">{getFurnitureLabel(exportForm.furnitureId)}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Quantity (Units)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="0"
                          value={exportForm.quantity}
                          onChange={(e) => setExportForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Export Date</label>
                        <input
                          type="date"
                          value={exportForm.date}
                          onChange={(e) => setExportForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-lg transition shadow-sm"
                    >
                      save Export
                    </button>
                  </form>
                </div>
              </div>
              {/* Warehouse Stock Balance Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-slate-800 px-6 py-4">
                  <h2 className="text-sm font-bold text-white tracking-wide">Live Warehouse Stock Balance</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-3 w-20">ID</th>
                        <th className="px-6 py-3">Furniture Item Name</th>
                        <th className="px-6 py-3">Importer / Owner</th>
                        <th className="px-6 py-3 text-center">Total Imported</th>
                        <th className="px-6 py-3 text-center">Total Exported</th>
                        <th className="px-6 py-3 text-right pr-6">Current Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {furnitureOptions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-400">No stock items found.</td>
                        </tr>
                      ) : (
                        furnitureOptions.map(item => (
                          <tr key={item.FurnitureId} className="hover:bg-slate-50">
                            <td className="px-6 py-3">{item.FurnitureId}</td>
                            <td className="px-6 py-3">{item.FurnitureName}</td>
                            <td className="px-6 py-3">{item.FurnitureOwnerName}</td>
                            <td className="px-6 py-3 text-center">—</td>
                            <td className="px-6 py-3 text-center">—</td>
                            <td className="px-6 py-3 text-right pr-6">—</td>
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