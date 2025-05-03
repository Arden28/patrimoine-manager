import React, { useState } from 'react';

const AssetForm = ({ onAddAsset }) => {
  const [category, setCategory] = useState('Property');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAsset({
      id: Date.now(),
      category,
      name,
      value: parseFloat(value),
      documents: [],
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setName('');
    setValue('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Asset</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Property</option>
          <option>Savings</option>
          <option>Vehicle</option>
          <option>Valuable Item</option>
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
        <label className="block text-gray-700">Value ($)</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Add Asset
      </button>
    </div>
  );
};

export default AssetForm;