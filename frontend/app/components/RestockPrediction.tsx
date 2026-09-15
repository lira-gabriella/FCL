'use client';

interface RestockPredictionProps {
  furnitureList: any[];
}

export default function RestockPrediction({ furnitureList }: RestockPredictionProps) {
  const items = furnitureList || [];
  if (items.length === 0) return null;

  // Predict restock dates based on current stock and export velocity
  const predictions = items
    .map((item) => {
      const stock = item.CurrentWarehouseStock || 0;
      const exports = item.TotalExported || 0;
      const imports = item.TotalImported || 0;

      // Simple velocity model: assume exports represent weekly demand
      const weeklyDemand = Math.max(1, exports);
      const weeksLeft = stock / weeklyDemand;
      const daysLeft = Math.round(weeksLeft * 7);

      let urgency = 'safe';
      let urgencyColor = 'text-emerald-600';
      let urgencyBg = 'bg-emerald-50';
      let urgencyBorder = 'border-emerald-200';

      if (daysLeft <= 0) {
        urgency = 'CRITICAL';
        urgencyColor = 'text-red-600';
        urgencyBg = 'bg-red-50';
        urgencyBorder = 'border-red-200';
      } else if (daysLeft <= 7) {
        urgency = 'URGENT';
        urgencyColor = 'text-amber-600';
        urgencyBg = 'bg-amber-50';
        urgencyBorder = 'border-amber-200';
      } else if (daysLeft <= 14) {
        urgency = 'WARNING';
        urgencyColor = 'text-blue-600';
        urgencyBg = 'bg-blue-50';
        urgencyBorder = 'border-blue-200';
      }

      return {
        name: item.FurnitureName,
        owner: item.FurnitureOwnerName,
        stock,
        daysLeft: Math.max(0, daysLeft),
        urgency,
        urgencyColor,
        urgencyBg,
        urgencyBorder,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-crystal-ball text-purple-600"></i>
          Restock Predictions
        </h3>
        <p className="text-xs text-gray-400 mt-1">AI-powered forecast based on export velocity</p>
      </div>
      <div className="divide-y divide-gray-100">
        {predictions.map((item, idx) => (
          <div key={idx} className={`px-6 py-4 border-l-4 ${item.urgencyBorder} ${item.urgencyBg} hover:bg-opacity-75 transition`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.owner}</p>
              </div>
              <span className={`text-xs font-black uppercase px-2 py-1 rounded ${item.urgencyColor} ${item.urgencyBg} whitespace-nowrap`}>
                {item.urgency}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs">
              <span className="text-gray-500">
                <i className="fas fa-cube mr-1"></i>{item.stock} units
              </span>
              <span className={item.urgencyColor}>
                <i className="fas fa-clock mr-1"></i>
                {item.daysLeft === 0 ? 'OUT OF STOCK' : `${item.daysLeft} days left`}
              </span>
            </div>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  item.daysLeft <= 0 ? 'bg-red-500' :
                  item.daysLeft <= 7 ? 'bg-amber-500' :
                  item.daysLeft <= 14 ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (item.stock / 50) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}