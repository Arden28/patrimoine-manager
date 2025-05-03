import React from 'react';
import DebtForm from './DebtForm';
import Sidebar from './Sidebar';

const DebtsPage = ({ user, debts, onAddDebt, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Debts" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debts</h1>
          <button onClick={onLogout} className="text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </header>
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Your Debts</h2>
              <DebtForm onAddDebt={onAddDebt} />
            </div>
            <div className="space-y-4">
              {debts.map(debt => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{debt.name}</p>
                    <p className="text-sm text-gray-600">{debt.category}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-gray-900 font-medium">${debt.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 text-right">
                    <button className="text-teal-500 hover:text-teal-600 font-medium">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;