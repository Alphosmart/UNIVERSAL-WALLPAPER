import React, { useState } from 'react';
import { toast } from 'react-toastify';
import uploadImage from '../helper/uploadImage';

const ImageUploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(selectedFile);
      setUploadedUrl(url);
      toast.success('Image uploaded successfully!');
      console.log('Upload successful:', url);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Image Upload Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-md border"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        {uploadedUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Result
            </label>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 break-all">
                {uploadedUrl.startsWith('data:') 
                  ? '✅ Image stored locally (base64 - will not persist after refresh)'
                  : `✅ Image uploaded to Cloudinary: ${uploadedUrl}`
                }
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-md">
          <strong>Note:</strong> If Cloudinary is not configured, images will be stored locally as base64 
          (temporary - will be lost on page refresh). Configure Cloudinary for persistent storage.
        </div>
      </div>
    </div>
  );
};

export default ImageUploadTest;
