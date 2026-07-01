'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [furnitureList, setFurnitureList] = useState<any[]>([]);
  const [furnitureName, setFurnitureName] = useState('');
  const [furnitureOwnerName, setFurnitureOwnerName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/dashboard'); // Updated URL
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

    await fetch('http://127.0.0.1:8000/api/furniture', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(itemData),
    });

    setFurnitureName('');
    setFurnitureOwnerName('');
    fetchDashboardData(); 
  };

  const handleDeleteFurniture = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/furniture/${id}`, {
        method: 'DELETE',
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-[#0a192f] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
            <span className="text-xl font-bold tracking-wider uppercase">CARGO Ltd</span>
          </div>
          <nav className="p-4 space-y-2">
            <button onClick={() => window.location.href = '/dashboard'} className="w-full flex items-center space-x-3 px-4 py-3 rounded bg-blue-600 font-medium text-white transition text-left">
              <span>Dashboard Overview</span>
            </button>
            <button onClick={() => window.location.href = '/transactions'} className="w-full flex items-center space-x-3 px-4 py-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition text-left">
              <span>Transactions</span>
            </button>

             <button onClick={() => window.location.href = '/report'} className="w-full flex items-center space-x-3 px-4 py-3 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition text-left">
              <span>Report</span>
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white h-16 px-8 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div className="text-sm text-gray-500 font-medium">System Status: <span className="text-green-600 font-bold">● Live Operational</span></div>
        </header>

        <main className="flex-1 p-8 mx-auto w-full max-w-[1400px] space-y-8">
          {/* Info Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Furniture Types</p>
              <h3 className="text-3xl font-black mt-2 text-slate-800">{furnitureList.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Imports Logged</p>
              <h3 className="text-3xl font-black mt-2 text-green-600">{furnitureList.reduce((sum, item) => sum + (item.TotalImported || 0), 0)}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Exports Logged</p>
              <h3 className="text-3xl font-black mt-2 text-red-600">{furnitureList.reduce((sum, item) => sum + (item.TotalExported || 0), 0)}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">Net Stock Balance</p>
              <h3 className="text-3xl font-black mt-2 text-blue-600">
                {furnitureList.reduce((sum, item) => sum + (item.CurrentWarehouseStock || 0), 0)}
              </h3>
            </div>
          </section>

          {/* Register new furniture */}
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
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition">Save Type</button>
            </form>
          </section>

          {/* Data Table */}
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
                {furnitureList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-400">No stock items found.</td>
                  </tr>
                ) : (
                  furnitureList.map((item) => (
                    <tr key={item.FurnitureId} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-xs text-gray-400">#{item.FurnitureId}</td>
                      <td className="p-4 font-bold text-slate-800">{item.FurnitureName}</td>
                      <td className="p-4 text-gray-600">{item.FurnitureOwnerName}</td>
                      <td className="p-4 text-center">{item.TotalImported}</td>
                      <td className="p-4 text-center">{item.TotalExported}</td>
                      <td className="p-4 text-center">{item.CurrentWarehouseStock}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteFurniture(item.FurnitureId)} className="text-red-600 font-bold hover:underline">Delete</button>
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