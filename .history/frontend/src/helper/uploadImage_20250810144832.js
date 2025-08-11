const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const uploadImage = async(image) => {
    // Check if Cloudinary is configured
    if (!cloudName || cloudName === 'your_cloudinary_cloud_name') {
        throw new Error('Cloudinary configuration is missing. Please add your Cloudinary credentials to the .env file.');
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");

    try {
        const dataResponse = await fetch(url, {
            method: "POST",
            body: formData
        });

        if (!dataResponse.ok) {
            throw new Error(`HTTP error! status: ${dataResponse.status}`);
        }

        const result = await dataResponse.json();
        
        if (result.error) {
            throw new Error(result.error.message || 'Upload failed');
        }
        
        return result.secure_url || result.url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error(`Image upload failed: ${error.message}`);
    }
}

export default uploadImage
