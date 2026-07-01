'use client';

import { useState, useEffect } from 'react';

export default function TransactionsTabsPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [furnitureList, setFurnitureList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Entry Values
  const [selectedFurnitureId, setSelectedFurnitureId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/furniture');
      const data = await response.json();
      if (Array.isArray(data)) {
        setFurnitureList(data);
      }
    } catch (err) {
      console.error("Could not reach backend server", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      FurnitureId: parseInt(selectedFurnitureId),
      ImportDate: transactionDate, 
      Quantity: parseInt(quantity)
    };

   
    const endpoint = activeTab === 'import' ? '/api/import' : '/api/export';

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      setSuccessMessage(`${activeTab === 'import' ? 'Import' : 'Export'} Saved: ${result.message}`);

      setSelectedFurnitureId(''); setTransactionDate(''); setQuantity('');
      fetchItems();
    } catch (err) {
      setSuccessMessage("Failed to connect to backend server. Make sure it is running.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
 
      <aside className="w-64 bg-[#0a192f] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
            <i className="fa-solid fa-layer-group text-xl text-blue-400"></i>
            <span className="text-lg font-bold tracking-wider uppercase">CARGO Ltd</span>
          </div>
          <nav className="p-4 space-y-1 text-sm">
            <button onClick={() => window.location.href = '/dashboard'} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded text-gray-400 hover:bg-gray-800/50 hover:text-white transition text-left">
              <i className="fa-solid fa-gauge w-5"></i><span>Dashboard</span>
            </button>
            <button onClick={() => window.location.href = '/transactions'} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded bg-blue-600 font-medium text-white transition text-left">
              <i className="fa-solid fa-right-left w-5"></i><span>Transactions</span>
            </button>
            <button onClick={() => window.location.href = '/reports'} className="w-full flex items-center space-x-3 px-4 py-2.5 rounded text-gray-400 hover:bg-gray-800/50 hover:text-white transition text-left">
              <i className="fa-solid fa-file-invoice w-5"></i><span>Reports</span>
            </button>
          </nav>
        </div>
      </aside>


      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="bg-white h-16 px-8 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Manage Warehouse Movements</h2>
        </header>

        <main className="p-8 max-w-5xl w-full mx-auto space-y-6">
          
          <div className="flex border-b border-gray-200 space-x-4">
            <button 
              type="button"
              onClick={() => { setActiveTab('import'); setSuccessMessage(''); }}
              className={`pb-3 text-sm font-bold tracking-wide transition-all ${activeTab === 'import' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fa-solid fa-circle-arrow-down mr-1"></i> Imports Section
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('export'); setSuccessMessage(''); }}
              className={`pb-3 text-sm font-bold tracking-wide transition-all ${activeTab === 'export' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fa-solid fa-circle-arrow-up mr-1"></i> Exports Section
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm font-medium">
              <i className="fa-solid fa-circle-check mr-1"></i> {successMessage}
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className={`text-md font-bold uppercase ${activeTab === 'import' ? 'text-green-600' : 'text-red-600'}`}>
              Record {activeTab === 'import' ? 'Incoming Cargo' : 'Outgoing Dispatches'}
            </h3>
            
            <form onSubmit={handleTransactionSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Furniture</label>
                <select value={selectedFurnitureId} onChange={(e) => setSelectedFurnitureId(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-slate-900">
                  <option value="">-- Choose Item --</option>
                  {furnitureList.map((item) => (
                    <option key={item.FurnitureId} value={item.FurnitureId}>
                      {item.FurnitureName} ({item.FurnitureOwnerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-slate-900" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                <input type="number" min="1" placeholder="Enter units" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-slate-900" />
              </div>

              <button type="submit" className={`w-full md:w-auto md:col-span-3 text-white font-bold py-2 px-6 rounded-lg text-sm transition ${activeTab === 'import' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Save {activeTab === 'import' ? 'Import' : 'Export'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <input 
                type="text" 
                placeholder={`Search current ${activeTab}...`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg text-sm bg-white w-64 text-slate-900"
              />
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b">
                  <th className="px-6 py-3">Furniture Name</th>
                  <th className="px-6 py-3">Owner Business</th>
                  <th className="px-6 py-3 text-center">Calculated Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {furnitureList
                  .filter(item => item.FurnitureName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <tr key={item.FurnitureId} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800">{item.FurnitureName}</td>
                      <td className="px-6 py-4 text-gray-600">{item.FurnitureOwnerName}</td>
                      <td className={`px-6 py-4 text-center font-bold ${activeTab === 'import' ? 'text-green-600' : 'text-red-600'}`}>
                        {activeTab === 'import' ? `+${item.TotalImported}` : `-${item.TotalExported}`} units
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}
