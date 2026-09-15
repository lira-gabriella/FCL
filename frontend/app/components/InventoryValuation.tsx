'use client';

interface ValuationItem {
  name: string;
  owner: string;
  stock: number;
  unitPrice: number;
  totalValue: number;
}

interface InventoryValuationProps {
  furnitureList: any[];
}

export default function InventoryValuation({ furnitureList }: InventoryValuationProps) {
  const items = furnitureList || [];
  if (items.length === 0) return null;

  // Estimate unit prices based on furniture type (simulated pricing)
  const priceMap: Record<string, number> = {
    'Office Chair': 85, 'Executive Desk': 450, 'Conference Table': 320,
    'Filing Cabinet': 120, 'Bookshelf': 95, 'Storage Rack': 60,
    'Reception Sofa': 280, 'Meeting Table': 220, 'Cabinet': 150,
    'Shelf': 75, 'Table': 180, 'Chair': 65, 'Desk': 250,
  };

  const valuation: ValuationItem[] = items.map((item) => {
    const stock = item.CurrentWarehouseStock || 0;
    const unitPrice = priceMap[item.FurnitureName] || 100;
    return {
      name: item.FurnitureName,
      owner: item.FurnitureOwnerName,
      stock,
      unitPrice,
      totalValue: stock * unitPrice,
    };
  });

  const totalValue = valuation.reduce((sum, i) => sum + i.totalValue, 0);
  const totalCost = valuation.reduce((sum, i) => sum + i.stock * i.unitPrice * 0.6, 0); // estimated cost at 60% of retail
  const potentialProfit = totalValue - totalCost;

  const topItems = valuation.sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <i className="fas fa-dollar-sign text-green-600"></i>
          Inventory Valuation
        </h3>
        <p className="text-xs text-gray-400 mt-1">Estimated monetary value of current warehouse stock</p>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
          <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalValue)}</p>
          <p className="text-xs font-bold text-emerald-600 uppercase">Retail Value</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-2xl font-black text-blue-700">{formatCurrency(totalCost)}</p>
          <p className="text-xs font-bold text-blue-600 uppercase">Est. Cost</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <p className="text-2xl font-black text-purple-700">{formatCurrency(potentialProfit)}</p>
          <p className="text-xs font-bold text-purple-600 uppercase">Potential Profit</p>
        </div>
      </div>

      <div className="px-6 pb-4">
        <h4 className="text-sm font-bold text-slate-700 mb-2">Top Valued Items</h4>
        <div className="space-y-2">
          {topItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">{item.stock} units @ ${item.unitPrice}</p>
              </div>
              <span className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(item.totalValue)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}