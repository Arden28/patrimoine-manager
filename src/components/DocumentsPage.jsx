import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './Sidebar';
import Modal from './Modal';
import Header from './Header';
import { AppContext } from '../AppContext';

const DocumentsPage = ({ user, assets, onUploadDocument, onDeleteDocument, onLogout }) => {
  const { t } = useContext(AppContext);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('File input changed:', selectedFile);
    if (selectedFile && ['application/pdf', 'image/png', 'image/jpeg'].includes(selectedFile.type)) {
      setFile(selectedFile);
      console.log('Valid file selected:', selectedFile.name, selectedFile.type);
    } else {
      alert(t('onlyPDFOrImage'));
      setFile(null);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { selectedAssetId, file });
    if (file && selectedAssetId) {
      console.log('Calling onUploadDocument:', selectedAssetId, file.name);
      onUploadDocument(selectedAssetId, file.name);
      setFile(null);
      setSelectedAssetId('');
      setIsUploadModalOpen(false);
    } else {
      alert(t('selectAssetAndFile'));
      console.log('Upload failed: Missing asset or file');
    }
  };

  // Log assets whenever they change
  useEffect(() => {
    console.log('DocumentsPage assets updated:', assets);
  }, [assets]);

  console.log('DocumentsPage rendering with assets:', assets);
  console.log('onUploadDocument prop:', onUploadDocument);

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleDownloadDeclaration = () => {
    alert(t('downloadDeclarationPlaceholder'));
    // Placeholder: To be implemented with LaTeX PDF generation
  };

  console.log('Assets received:', assets);

  const userName = user && typeof user.email === 'string' ? user.email.split('@')[0] : 'User';
  const text = t('documents');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeLink="Documents" onLogout={onLogout} />
      <div className="flex-1 md:ml-64 p-6 lg:p-8">
        <Header onText={text} onLogout={onLogout} onHandleDownloadDeclaration={handleDownloadDeclaration} />
        <div className="animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('documents')}</h2>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
              >
                {t('uploadDocument')}
              </button>
            </div>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{asset.name}</h3>
                  {asset.documents.length > 0 ? (
                    asset.documents.map((document, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-primary-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <p className="text-gray-900">{document}</p>
                        </div>
                        
                        <div className="space-x-2">
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="text-primary-500 hover:text-primary-600 font-medium"
                          >
                            {t('view')}
                          </button>
                          <button
                            onClick={() => onDeleteDocument(asset.id, document)}
                            className="text-red-500 hover:text-red-600 font-medium"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">{t('noDocuments')}</p>
                  )}
                  <input
                    type="file"
                    onChange={(e) => onUploadDocument(asset.id, e.target.files[0]?.name)}
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Upload Document Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title={t('uploadDocument')}>
        <form onSubmit={handleUploadSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('asset')}</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">{t('selectAsset')}</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>{asset.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{t('document')}</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-500 transition-colors duration-200">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-500 hover:text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                  >
                    <span>{t('uploadFile')}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="application/pdf,image/png,image/jpeg"
                      className="sr-only"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">{t('orDragDrop')}</p>
                </div>
                <p className="text-xs text-gray-500">{t('pdfOrImageOnly')}</p>
                {file && <p className="text-sm text-gray-900 mt-2">{file.name}</p>}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            {t('uploadDocument')}
          </button>
        </form>
      </Modal>
      {/* View Document Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={t('viewDocument')}>
        <div className="p-4">
          <p className="text-gray-600 mb-4">{t('pdfPreview')} {selectedDocument}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-900">{t('pdfPlaceholder')} {selectedDocument}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentsPage;