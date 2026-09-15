'use client';

interface HealthScoreProps {
  furnitureList: any[];
}

export default function InventoryHealthScore({ furnitureList }: HealthScoreProps) {
  const items = furnitureList || [];
  if (items.length === 0) return null;

  const totalStock = items.reduce((sum, i) => sum + (i.CurrentWarehouseStock || 0), 0);
  const totalImports = items.reduce((sum, i) => sum + (i.TotalImported || 0), 0);
  const totalExports = items.reduce((sum, i) => sum + (i.TotalExported || 0), 0);
  const emptyCount = items.filter((i) => (i.CurrentWarehouseStock || 0) === 0).length;
  const lowCount = items.filter((i) => {
    const s = i.CurrentWarehouseStock || 0;
    return s > 0 && s <= 10;
  }).length;
  const healthyCount = items.filter((i) => (i.CurrentWarehouseStock || 0) > 10).length;

  // Health score algorithm: weighted composite
  const stockRatio = totalImports > 0 ? totalStock / totalImports : 0;
  const healthRatio = items.length > 0 ? healthyCount / items.length : 0;
  const emptyPenalty = items.length > 0 ? emptyCount / items.length : 0;
  const rawScore = (stockRatio * 30 + healthRatio * 50 + (1 - emptyPenalty) * 20);
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let grade = 'F';
  let gradeColor = 'text-red-600';
  let gradeBg = 'bg-red-100';
  let message = 'Critical stock situation';

  if (score >= 90) { grade = 'A'; gradeColor = 'text-emerald-600'; gradeBg = 'bg-emerald-100'; message = 'Excellent inventory health'; }
  else if (score >= 75) { grade = 'B'; gradeColor = 'text-green-600'; gradeBg = 'bg-green-100'; message = 'Good stock management'; }
  else if (score >= 60) { grade = 'C'; gradeColor = 'text-blue-600'; gradeBg = 'bg-blue-100'; message = 'Moderate stock levels'; }
  else if (score >= 40) { grade = 'D'; gradeColor = 'text-amber-600'; gradeBg = 'bg-amber-100'; message = 'Stock concerns detected'; }
  else { grade = 'F'; gradeColor = 'text-red-600'; gradeBg = 'bg-red-100'; message = 'Critical stock situation'; }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-heartbeat text-red-500"></i>
        Inventory Health Score
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="56" cy="56" r="48" fill="none"
              stroke={score >= 75 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="10"
              strokeDasharray={`${(score / 100) * 301.6} 301.6`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{score}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${gradeBg} mb-2`}>
            <span className={`text-2xl font-black ${gradeColor}`}>{grade}</span>
            <span className={`text-sm font-bold ${gradeColor}`}>Grade</span>
          </div>
          <p className="text-sm text-gray-500 mb-3">{message}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50 rounded-lg p-2">
              <p className="text-lg font-black text-emerald-600">{healthyCount}</p>
              <p className="text-xs text-gray-500">Healthy</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-2">
              <p className="text-lg font-black text-amber-600">{lowCount}</p>
              <p className="text-xs text-gray-500">Low</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <p className="text-lg font-black text-red-600">{emptyCount}</p>
              <p className="text-xs text-gray-500">Empty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}