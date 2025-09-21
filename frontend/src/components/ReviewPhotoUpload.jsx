import React, { useState, useCallback } from 'react';
import { FaTimes, FaCamera } from 'react-icons/fa';

const ReviewPhotoUpload = ({ photos, onPhotosChange, maxPhotos = 5 }) => {
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).slice(0, maxPhotos - photos.length);
    if (newFiles.length === 0) return;

    setUploadingPhotos(true);

    try {
      const uploadPromises = newFiles.map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Image size must be less than 5MB');
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        // In a real implementation, you would upload to a cloud service like Cloudinary
        // For now, we'll just use the preview URL
        return {
          file,
          url: previewUrl,
          id: Date.now() + Math.random()
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      onPhotosChange([...photos, ...uploadedPhotos]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert(error.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  }, [photos, onPhotosChange, maxPhotos]);

  const handleFileInput = (e) => {
    handlePhotoUpload(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handlePhotoUpload(e.dataTransfer.files);
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Add Photos ({photos.length}/{maxPhotos})
      </label>
      
      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt="Review attachment"
                className="w-full h-20 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploadingPhotos ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="photo-upload"
            disabled={uploadingPhotos}
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <FaCamera className="text-gray-400 text-2xl" />
            <div className="text-sm text-gray-600">
              {uploadingPhotos ? (
                <span>Uploading photos...</span>
              ) : (
                <span>
                  Drop photos here or <span className="text-blue-600 underline">browse</span>
                  <br />
                  <span className="text-xs text-gray-500">
                    Up to {maxPhotos - photos.length} more photos (Max 5MB each)
                  </span>
                </span>
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ReviewPhotoUpload;