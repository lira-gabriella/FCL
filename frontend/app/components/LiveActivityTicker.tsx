'use client';

import { useState, useEffect } from 'react';

interface ActivityItem {
  id: number;
  type: 'import' | 'export';
  furnitureName: string;
  quantity: number;
  ownerName: string;
  timestamp: string;
}

export default function LiveActivityTicker() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simulate live activity feed from recent transactions
    const generateActivity = () => {
      const types: ('import' | 'export')[] = ['import', 'export'];
      const furnitureNames = ['Office Chair', 'Executive Desk', 'Conference Table', 'Filing Cabinet', 'Bookshelf', 'Storage Rack', 'Reception Sofa', 'Meeting Table'];
      const owners = ['Kigali Traders', 'Rwanda Furniture Co', 'Tech Office Ltd', 'Mamas Decor', 'Corporate Solutions', 'Home & Style'];
      const items: ActivityItem[] = [];
      for (let i = 0; i < 6; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        items.push({
          id: Date.now() + i,
          type,
          furnitureName: furnitureNames[Math.floor(Math.random() * furnitureNames.length)],
          quantity: Math.floor(Math.random() * 50) + 1,
          ownerName: owners[Math.floor(Math.random() * owners.length)],
          timestamp: new Date().toLocaleTimeString(),
        });
      }
      return items;
    };

    setActivities(generateActivity());
    const interval = setInterval(() => {
      setActivities(generateActivity());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-broadcast-tower text-red-500 animate-pulse"></i>
          Live Activity Feed
        </h3>
        <span className="text-xs text-gray-400 font-mono">Updates every 5s</span>
      </div>
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {activities.map((item) => (
          <div key={item.id} className="px-6 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.type === 'import' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <i className={`fas ${item.type === 'import' ? 'fa-arrow-down' : 'fa-arrow-up'} text-sm`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {item.type === 'import' ? 'Import' : 'Export'}: <span className="font-normal">{item.furnitureName}</span>
              </p>
              <p className="text-xs text-gray-400">{item.ownerName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`text-sm font-bold ${item.type === 'import' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {item.type === 'import' ? '+' : '-'}{item.quantity}
              </span>
              <p className="text-xs text-gray-400 font-mono">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}