import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import AssetForm from './AssetForm';
import DebtForm from './DebtForm';
import DocumentVault from './DocumentVault';
import Notifications from './Notifications';
import FamilySharing from './FamilySharing';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, assets, debts, notifications, familyMembers, onAddAsset, onAddDebt, onUploadDocument, onAddFamilyMember, onLogout }) => {
  const netWorth = assets.reduce((sum, asset) => sum + asset.value, 0) - debts.reduce((sum, debt) => sum + debt.amount, 0);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById('netWorthChart')?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.3)');
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Net Worth ($)',
          data: [250000, 260000, 270000, 280000, netWorth],
          borderColor: '#2DD4BF',
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#2DD4BF',
          pointHoverBackgroundColor: '#2DD4BF',
          pointHoverBorderColor: '#FFFFFF',
        }],
      },
      options: {
        scales: {
          y: { beginAtZero: false, grid: { color: '#E5E7EB' }, ticks: { color: '#6B7280' } },
          x: { grid: { display: false }, ticks: { color: '#6B7280' } },
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 14, weight: 'bold' }, color: '#1E3A8A' } },
          tooltip: { backgroundColor: '#1E3A8A', titleColor: '#FFFFFF', bodyColor: '#FFFFFF', borderColor: '#2DD4BF', borderWidth: 1 },
        },
        interaction: { mode: 'index', intersect: false },
        hover: { mode: 'index', intersect: false },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [netWorth]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Dashboard" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.email.split('@')[0]}</h1>
          <button onClick={onLogout} className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </header>
        <div className="animate-fade-in">
          {/* Overview Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
              <Link to="/assets" className="text-teal-500 hover:text-teal-600 font-medium">View All Assets</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Net Worth
                </h3>
                <p className="text-3xl font-bold text-teal-500">${netWorth.toLocaleString()}</p>
                <canvas id="netWorthChart" className="mt-6"></canvas>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Summary
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">Total Assets: <span className="font-medium text-gray-900">${assets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}</span></p>
                  <p className="text-gray-600">Total Debts: <span className="font-medium text-gray-900">${debts.reduce((sum, debt) => sum + debt.amount, 0).toLocaleString()}</span></p>
                  <p className="text-gray-600">Notifications: <span className="font-medium text-gray-900">{notifications.length}</span></p>
                  <p className="text-gray-600">Family Members: <span className="font-medium text-gray-900">{familyMembers.length}</span></p>
                </div>
                <Link to="/notifications" className="mt-4 inline-block text-teal-500 hover:text-teal-600 font-medium">View Notifications</Link>
              </div>
            </div>
          </section>
          {/* Assets and Debts Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Assets & Debts</h2>
              <Link to="/debts" className="text-teal-500 hover:text-teal-600 font-medium">View All Debts</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path>
                  </svg>
                  Recent Assets
                </h3>
                <div className="space-y-3">
                  {assets.slice(0, 3).map(asset => (
                    <div key={asset.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 font-medium">{asset.name}</p>
                        <p className="text-sm text-gray-600">{asset.category}</p>
                      </div>
                      <p className="text-gray-900 font-medium">${asset.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <AssetForm onAddAsset={onAddAsset} />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Recent Debts
                </h3>
                <div className="space-y-3">
                  {debts.slice(0, 3).map(debt => (
                    <div key={debt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-900 font-medium">{debt.name}</p>
                        <p className="text-sm text-gray-600">{debt.category}</p>
                      </div>
                      <p className="text-gray-900 font-medium">${debt.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <DebtForm onAddDebt={onAddDebt} />
              </div>
            </div>
          </section>
          {/* Other Tools Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Other Tools</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Document Vault
                </h3>
                <DocumentVault assets={assets} onUploadDocument={onUploadDocument} />
                <Link to="/documents" className="mt-4 inline-block text-teal-500 hover:text-teal-600 font-medium">View All Documents</Link>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  Notifications
                </h3>
                <Notifications notifications={notifications} />
                <Link to="/notifications" className="mt-4 inline-block text-teal-500 hover:text-teal-600 font-medium">View All Notifications</Link>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Family Sharing
                </h3>
                <FamilySharing familyMembers={familyMembers} onAddFamilyMember={onAddFamilyMember} />
                <Link to="/family-sharing" className="mt-4 inline-block text-teal-500 hover:text-teal-600 font-medium">Manage Family</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;