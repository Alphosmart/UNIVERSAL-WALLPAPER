// Temporary local image upload solution (for testing without Cloudinary)
// This will store images as base64 in browser memory - NOT PERSISTENT

const uploadImageLocal = async(image) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            // Convert to base64 and resolve
            const base64String = reader.result;
            console.log('Image converted to base64 (local storage)');
            resolve(base64String);
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read image file'));
        };
        
        // Validate file size (max 5MB)
        if (image.size > 5 * 1024 * 1024) {
            reject(new Error('Image size must be less than 5MB'));
            return;
        }
        
        // Validate file type
        if (!image.type.startsWith('image/')) {
            reject(new Error('Please select a valid image file'));
            return;
        }
        
        reader.readAsDataURL(image);
    });
};

// Main upload function with Cloudinary + local fallback
const cloudName = process.env.REACT_APP_CLOUD_NAME_CLOUDINARY;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const uploadImage = async(image) => {
    // Check if Cloudinary is properly configured
    if (!cloudName || cloudName === 'your_cloudinary_cloud_name' || cloudName === 'your-cloudinary-cloud-name') {
        console.warn('Cloudinary not configured, using local storage fallback');
        return await uploadImageLocal(image);
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
            console.warn('Cloudinary upload failed, falling back to local storage');
            return await uploadImageLocal(image);
        }

        const result = await dataResponse.json();
        
        if (result.error) {
            console.warn('Cloudinary error, falling back to local storage:', result.error);
            return await uploadImageLocal(image);
        }
        
        console.log('Image uploaded to Cloudinary successfully');
        return result.secure_url || result.url;
    } catch (error) {
        console.warn('Cloudinary upload failed, falling back to local storage:', error);
        return await uploadImageLocal(image);
    }
}

export default uploadImage
