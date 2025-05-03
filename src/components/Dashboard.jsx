import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AssetForm from './AssetForm';
import DebtForm from './DebtForm';
import DocumentVault from './DocumentVault';
import Notifications from './Notifications';
import FamilySharing from './FamilySharing';

const Dashboard = ({ user, assets, debts, notifications, familyMembers, onAddAsset, onAddDebt, onUploadDocument, onAddFamilyMember }) => {
  const netWorth = assets.reduce((sum, asset) => sum + asset.value, 0) - debts.reduce((sum, debt) => sum + debt.amount, 0);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById('netWorthChart')?.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Net Worth ($)',
          data: [250000, 260000, 270000, 280000, netWorth],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }],
      },
      options: { scales: { y: { beginAtZero: false } } },
    });

    // Cleanup: destroy chart on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [netWorth]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Net Worth</h2>
          <p className="text-2xl font-bold text-green-600">${netWorth.toLocaleString()}</p>
          <canvas id="netWorthChart" className="mt-4"></canvas>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Assets</h2>
          {assets.map(asset => (
            <div key={asset.id} className="mb-2">
              <p>{asset.name} ({asset.category}): ${asset.value.toLocaleString()}</p>
            </div>
          ))}
          <AssetForm onAddAsset={onAddAsset} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Debts</h2>
          {debts.map(debt => (
            <div key={debt.id} className="mb-2">
              <p>{debt.name} ({debt.category}): ${debt.amount.toLocaleString()}</p>
            </div>
          ))}
          <DebtForm onAddDebt={onAddDebt} />
        </div>
        <DocumentVault assets={assets} onUploadDocument={onUploadDocument} />
        <Notifications notifications={notifications} />
        <FamilySharing familyMembers={familyMembers} onAddFamilyMember={onAddFamilyMember} />
      </div>
    </div>
  );
};

export default Dashboard;