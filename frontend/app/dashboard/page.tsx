'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [furnitureList, setFurnitureList] = useState<any[]>([]);
  const [furnitureName, setFurnitureName] = useState('');
  const [furnitureOwnerName, setFurnitureOwnerName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
    
      const response = await fetch('http://localhost:8000/api/report/status'); 
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
      const response = await fetch('http://localhost:8000/api/furniture', {
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
   
      await fetch(`http://localhost:8000/api/furniture/${id}`, {
        method: 'DELETE',
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-slate-800">

      <aside className="w-64 bg-[#0a192f] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
            <span className="text-xl font-bold tracking-wider uppercase">CARGO Ltd</span>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard" className="w-full flex items-center space-x-3 px-4 py-3 rounded bg-blue-600 font-medium text-white transition text-left">
              <span>Dashboard Overview</span>
            </Link>
            <Link href="/transactions" className="w-full flex items-center space-x-3 px-4 py-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition text-left">
              <span>Transactions</span>
            </Link>
            <Link href="/report" className="w-full flex items-center space-x-3 px-4 py-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition text-left">
              <span>Report</span>
            </Link>
          </nav>
        </div>
      </aside>

    
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white h-16 px-8 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div className="text-sm text-gray-500 font-medium">
            System Status: <span className="text-green-600 font-bold">● Live Operational</span>
          </div>
        </header>

        <main className="flex-1 p-8 mx-auto w-full max-w-[1400px] space-y-8">
      
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Furniture Types</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800">{furnitureList.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Imports Logged</p>
              <h3 className="text-3xl font-black mt-2 text-green-600">
                {furnitureList.reduce((sum, item) => sum + (item.TotalImported || 0), 0)}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Exports Logged</p>
              <h3 className="text-3xl font-black mt-2 text-red-600">
                {furnitureList.reduce((sum, item) => sum + (item.TotalExported || 0), 0)}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Net Stock Balance</p>
              <h3 className="text-3xl font-black mt-2 text-blue-600">
                {furnitureList.reduce((sum, item) => sum + (item.CurrentWarehouseStock || 0), 0)}
              </h3>
            </div>
          </section>

         
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Register New Furniture Type</h2>
            <form onSubmit={handleAddFurniture} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Furniture Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Office Chair"
                  value={furnitureName}
                  onChange={(e) => setFurnitureName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Owner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kigali Traders"
                  value={furnitureOwnerName}
                  onChange={(e) => setFurnitureOwnerName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition">
                Save Type
              </button>
            </form>
          </section>

       
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-slate-700 p-4 font-bold text-sm text-white">Active Registered Warehouse Item Types</div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                  <th className="p-4 w-24">ID</th>
                  <th className="p-4">Furniture Type Name</th>
                  <th className="p-4">Importer / Owner</th>
                  <th className="p-4 text-center w-32">Total Imported</th>
                  <th className="p-4 text-center w-32">Total Exported</th>
                  <th className="p-4 text-center w-32">Current Stock</th>
                  <th className="p-4 text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-400 animate-pulse">Loading secure tracking streams...</td>
                  </tr>
                ) : furnitureList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-400 italic">No stock items found.</td>
                  </tr>
                ) : (
                  furnitureList.map((item) => (
                    <tr key={item.FurnitureId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-400">#{item.FurnitureId}</td>
                      <td className="p-4 font-bold text-slate-800">{item.FurnitureName}</td>
                      <td className="p-4 text-gray-600">{item.FurnitureOwnerName}</td>
                      <td className="p-4 text-center font-mono text-emerald-600 font-bold">{item.TotalImported}</td>
                      <td className="p-4 text-center font-mono text-amber-600 font-bold">{item.TotalExported}</td>
                      <td className="p-4 text-center font-mono text-blue-600 font-black">{item.CurrentWarehouseStock}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteFurniture(item.FurnitureId)} 
                          className="text-red-600 font-bold hover:text-red-800 hover:underline transition-all"
                        >
                          Delete
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