import React, { useState } from 'react';

const DebtForm = ({ onAddDebt }) => {
  const [category, setCategory] = useState('Mortgage');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDebt({
      id: Date.now(),
      category,
      name,
      amount: parseFloat(amount),
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setName('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Debt</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Mortgage</option>
          <option>Car Loan</option>
          <option>Personal Loan</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Add Debt
      </button>
    </div>
  );
};

export default DebtForm;