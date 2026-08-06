const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;

const uploadHeroMedia = async (file) => {
  if (!file) throw new Error('Choose a media file first');

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  if (!isImage && !isVideo) {
    throw new Error('Only image and video files are supported');
  }

  const maximumSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maximumSize) {
    throw new Error(`${isVideo ? 'Video' : 'Image'} size must be less than ${isVideo ? '50MB' : '5MB'}`);
  }

  if (!cloudName || cloudName.includes('your_') || cloudName.includes('your-')) {
    throw new Error('Cloudinary must be configured before uploading videos');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mern_product');

  const resourceType = isVideo ? 'video' : 'image';
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  });
  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error?.message || 'Cloudinary upload failed');
  }

  if (!result.secure_url?.startsWith('https://')) {
    throw new Error('Cloudinary did not return a secure media URL');
  }

  return result.secure_url;
};

export default uploadHeroMedia;
