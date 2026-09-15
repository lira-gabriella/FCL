'use client';

interface AgingItem {
  name: string;
  owner: string;
  stock: number;
  lastMovement: number;
  agingDays: number;
  status: 'dead' | 'slow' | 'normal';
}

interface StockAgingProps {
  furnitureList: any[];
}

export default function StockAgingAnalysis({ furnitureList }: StockAgingProps) {
  const items = furnitureList || [];
  if (items.length === 0) return null;

  const analyze = items.map((item) => {
    const stock = item.CurrentWarehouseStock || 0;
    const totalMovement = (item.TotalImported || 0) + (item.TotalExported || 0);
    const exportVelocity = item.TotalExported || 0;

    let agingDays = 0;
    let status: 'dead' | 'slow' | 'normal' = 'normal';

    if (stock > 0 && exportVelocity === 0) {
      agingDays = 90;
      status = 'dead';
    } else if (stock > 0 && exportVelocity > 0) {
      const weeksToDeplete = stock / exportVelocity;
      agingDays = Math.round(weeksToDeplete * 7);
      if (agingDays > 60) status = 'slow';
      else if (agingDays > 30) status = 'normal';
    } else if (stock === 0) {
      agingDays = 0;
      status = 'dead';
    }

    return {
      name: item.FurnitureName,
      owner: item.FurnitureOwnerName,
      stock,
      lastMovement: item.TotalExported || 0,
      agingDays,
      status,
    };
  });

  const deadStock = analyze.filter((i) => i.status === 'dead');
  const slowMovers = analyze.filter((i) => i.status === 'slow');
  const normal = analyze.filter((i) => i.status === 'normal');

  const statusConfig = {
    dead: { label: 'Dead Stock', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: 'fa-exclamation-triangle' },
    slow: { label: 'Slow Mover', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'fa-clock' },
    normal: { label: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'fa-check-circle' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-hourglass-half text-orange-500"></i>
          Stock Aging Analysis
        </h3>
        <p className="text-xs text-gray-400 mt-1">Identify dead stock and slow-moving inventory</p>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-3xl font-black text-red-600">{deadStock.length}</p>
          <p className="text-xs font-bold text-red-500 uppercase">Dead Stock</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200">
          <p className="text-3xl font-black text-amber-600">{slowMovers.length}</p>
          <p className="text-xs font-bold text-amber-500 uppercase">Slow Movers</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
          <p className="text-3xl font-black text-emerald-600">{normal.length}</p>
          <p className="text-xs font-bold text-emerald-500 uppercase">Active</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {[...deadStock, ...slowMovers, ...normal].map((item, idx) => {
          const cfg = statusConfig[item.status];
          return (
            <div key={idx} className={`px-6 py-3 border-l-4 ${cfg.border} ${cfg.bg} hover:opacity-80 transition`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.owner}</p>
                </div>
                <span className={`text-xs font-black uppercase px-2 py-1 rounded ${cfg.color} ${cfg.bg} whitespace-nowrap`}>
                  {cfg.label}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-xs">
                <span className="text-gray-500"><i className="fas fa-cube mr-1"></i>{item.stock} units</span>
                <span className={cfg.color}>
                  <i className="fas fa-calendar mr-1"></i>
                  {item.agingDays === 0 ? 'Out of stock' : `${item.agingDays}d since last movement`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}