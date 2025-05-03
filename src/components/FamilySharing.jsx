import React, { useState } from 'react';

const FamilySharing = ({ familyMembers, onAddFamilyMember }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Viewer');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFamilyMember({
      id: Date.now(),
      name,
      role,
    });
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Family Sharing</h2>
      {familyMembers.map(member => (
        <div key={member.id} className="mb-2">
          <p>{member.name} - {member.role}</p>
        </div>
      ))}
      <div className="mt-4">
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
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option>Viewer</option>
            <option>Editor</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Family Member
        </button>
      </div>
    </div>
  );
};

export default FamilySharing;