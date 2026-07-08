"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
    <div className="flex min-h-screen bg-gray-100 font-sans print:bg-white text-gray-800">
      <aside className="w-64 bg-[#0a192f] text-slate-400 flex flex-col justify-between shrink-0 shadow-xl print:hidden">
        <div>
          <div className="p-6 text-white font-bold text-lg tracking-wider border-b border-slate-800">
            CARGO LTD
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-400 rounded-lg text-sm font-medium transition">
              Dashboard Overview
            </Link>
            <Link href="/transactions" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-slate-400 rounded-lg text-sm font-medium transition">
              Transactions
            </Link>
            <Link href="/report" className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium transition">
              Active Stock Report
            </Link>
          </nav>
        </div>
      </aside>

   
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
       
        <header className="px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm print:hidden">
          <div className="text-sm font-medium text-gray-500">
            System Status: <span className="text-emerald-600 font-bold">● Live Operational</span>
          </div>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
             Export PDF / Print
          </button>
        </header>

        <main className="p-8 mx-auto w-full max-w-[1400px] space-y-8 print:p-0">
          
        
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Warehouse Audit Ledger Report</h1>
              <p className="text-gray-500 text-xs mt-0.5">Comprehensive list detailing real-time active inventory balance, imports, and logs.</p>
            </div>
            <div className="text-right text-xs text-gray-400 font-mono">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Scope: Active Stocks Only</p>
            </div>
          </div>

         
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monitored Profiles</p>
              <h3 className="text-2xl font-black mt-1 text-slate-800">{totalTypes} Types</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Volume Imported</p>
              <h3 className="text-2xl font-black mt-1 text-emerald-600">+{grandImports} Units</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Volume Exported</p>
              <h3 className="text-2xl font-black mt-1 text-amber-600">-{grandExports} Units</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm print:border-gray-300">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Current Balance</p>
              <h3 className="text-2xl font-black mt-1 text-blue-600">{currentNetStock} Available</h3>
            </div>
          </section>

        
          <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between print:hidden">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Filter by keyword (Item name, business owner...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 bg-gray-50"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {['all', 'healthy', 'low', 'empty'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setStockFilter(filterType)}
                  className={`text-xs px-4 py-2 rounded-lg font-bold capitalize transition ${
                    stockFilter === filterType 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <tr className="bg-slate-700 text-white text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 w-24">Item ID</th>
                  <th className="p-4">Furniture Type Description</th>
                  <th className="p-4">Assigned Trader / Client</th>
                  <th className="p-4 text-center w-36">Total Imported</th>
                  <th className="p-4 text-center w-36">Total Exported</th>
                  <th className="p-4 text-center w-36">Warehouse Stock</th>
                  <th className="p-4 text-center w-36">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 animate-pulse">Running server analytical query...</td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">No report profiles matched your query parameters.</td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    let statusLabel = "Healthy Balance";
                    let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

                    if (row.CurrentWarehouseStock === 0) {
                      statusLabel = "Out of Stock";
                      statusColor = "bg-red-50 text-red-700 border-red-200";
                    } else if (row.CurrentWarehouseStock <= 10) {
                      statusLabel = "Low Stock Hazard";
                      statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                    }

                    return (
                      <tr key={row.FurnitureId} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{row.FurnitureId}</td>
                        <td className="px-4 py-3">{row.FurnitureName}</td>
                        <td className="px-4 py-3">{row.FurnitureOwnerName}</td>
                        <td className="px-4 py-3 text-center">{row.TotalImported}</td>
                        <td className="px-4 py-3 text-center">{row.TotalExported}</td>
                        <td className="px-4 py-3 text-center">{row.CurrentWarehouseStock}</td>
                        <td className={`px-4 py-3 text-center border rounded ${statusColor}`}>
                          <span
                            className="block px-2 py-1 text-xs font-semibold rounded"
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