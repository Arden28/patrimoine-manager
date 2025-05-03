import React from 'react';

const DocumentVault = ({ assets, onUploadDocument }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Document Vault</h2>
      {assets.map(asset => (
        <div key={asset.id} className="mb-4">
          <p className="font-medium">{asset.name}</p>
          <p className="text-sm text-gray-600">Documents: {asset.documents.join(', ') || 'None'}</p>
          <input
            type="file"
            onChange={(e) => onUploadDocument(asset.id, e.target.files[0]?.name)}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentVault;