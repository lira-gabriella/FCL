'use client';

import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

interface DashboardChartsProps {
  furnitureList: any[];
}

export default function DashboardCharts({ furnitureList }: DashboardChartsProps) {
  const items = furnitureList || [];

  // Prepare data for histogram: imports vs exports by furniture type
  const labels = items.slice(0, 8).map((item) => item.Name || `Item ${item.ID}`);
  const imports = items.slice(0, 8).map((item) => item.TotalImported || 0);
  const exports = items.slice(0, 8).map((item) => item.TotalExported || 0);
  const stocks = items.slice(0, 8).map((item) => item.CurrentWarehouseStock || 0);

  const barData: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: 'Imports',
        data: imports,
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        borderRadius: 8,
        borderWidth: 0,
      },
      {
        label: 'Exports',
        data: exports,
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderRadius: 8,
        borderWidth: 0,
      },
      {
        label: 'Current Stock',
        data: stocks,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, family: 'serif', weight: 'bold' },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 13, family: 'serif' },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 13, family: 'serif' },
          precision: 0,
        },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
      },
    },
  };

  // Stock health distribution (doughnut)
  const healthy = items.filter((i) => (i.CurrentWarehouseStock || 0) > 50).length;
  const low = items.filter((i) => {
    const s = i.CurrentWarehouseStock || 0;
    return s > 0 && s <= 50;
  }).length;
  const empty = items.filter((i) => (i.CurrentWarehouseStock || 0) === 0).length;

  const doughnutData: ChartData<'doughnut'> = {
    labels: ['Healthy Stock', 'Low Stock', 'Empty'],
    datasets: [
      {
        data: [healthy, low, empty],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 12,
      },
    ],
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, family: 'serif', weight: 'bold' },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        cornerRadius: 12,
      },
    },
    cutout: '62%',
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <i className="fas fa-chart-bar text-blue-600"></i>
          Inventory Flow by Furniture Type
        </h3>
        <p className="text-gray-500 text-sm mb-4">Imports, exports, and current stock levels</p>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <i className="fas fa-chart-pie text-emerald-600"></i>
          Stock Health Distribution
        </h3>
        <p className="text-gray-500 text-sm mb-4">Current warehouse stock status breakdown</p>
        <div className="h-80 flex items-center justify-center">
          <div className="w-full max-w-[280px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}