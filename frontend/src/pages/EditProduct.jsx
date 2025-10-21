import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaTimes, FaArrowLeft } from 'react-icons/fa';
import uploadImage from '../helper/uploadImage';
import SummaryApi from '../common';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector(state => state?.user?.user);
    
    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: "",
        condition: "New"
    });

    // Fetch product data when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setProductLoading(true);
                const response = await fetch(`${SummaryApi.getSingleProduct.url}/${id}`, {
                    method: SummaryApi.getSingleProduct.method,
                    credentials: 'include'
                });

                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    toast.error(result.message || 'Failed to load product');
                    navigate('/my-products');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product');
                navigate('/my-products');
            } finally {
                setProductLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(SummaryApi.adminCategories.url, {
                    method: SummaryApi.adminCategories.method,
                    credentials: 'include'
                });
                const result = await response.json();
                
                if (result.success && result.categories) {
                    setCategories(result.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        if (id) {
            fetchProduct();
            fetchCategories();
        }
    }, [id, navigate]);

    // Check if user is the owner of the product
    useEffect(() => {
        if (!productLoading && data.seller && user?._id) {
            // Handle both populated seller object and direct seller ID
            const sellerId = typeof data.seller === 'object' ? data.seller._id : data.seller;
            const userId = user._id;
            
            if (sellerId !== userId) {
                toast.error('You can only edit your own products');
                navigate('/my-products');
            }
        }
    }, [data.seller, user?._id, navigate, productLoading]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadImageCloudinary = await uploadImage(file);
        
        setData(prev => ({
            ...prev,
            productImage: [...prev.productImage, uploadImageCloudinary.url]
        }));
    };

    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        
        setData(prev => ({
            ...prev,
            productImage: newProductImage
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!data.productName || !data.brandName || !data.category || !data.price || !data.sellingPrice) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (data.productImage.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        if (parseFloat(data.sellingPrice) > parseFloat(data.price)) {
            toast.error('Selling price cannot be greater than original price');
            return;
        }

        try {
            setLoading(true);
            
            const response = await fetch(`${SummaryApi.updateProduct.url}/${id}`, {
                method: SummaryApi.updateProduct.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Product updated successfully!');
                navigate('/my-products');
            } else {
                toast.error(result.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('An error occurred while updating the product');
        } finally {
            setLoading(false);
        }
    };

    if (productLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Loading product...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/my-products')}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Go back"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={data.productName}
                            onChange={handleOnChange}
                            placeholder="Enter product name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Brand Name */}
                    <div>
                        <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                            Brand Name *
                        </label>
                        <input
                            type="text"
                            id="brandName"
                            name="brandName"
                            value={data.brandName}
                            onChange={handleOnChange}
                            placeholder="Enter brand name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={data.category}
                            onChange={handleOnChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={category._id || index} value={category.name}>
                                    {category.displayName || category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Condition */}
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                        </label>
                        <select
                            id="condition"
                            name="condition"
                            value={data.condition}
                            onChange={handleOnChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>

                    {/* Product Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images *
                        </label>
                        
                        {/* Upload Area */}
                        <div className="mb-4">
                            <label htmlFor="uploadImageInput" className="cursor-pointer">
                                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-center">
                                    <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                                    <p className="text-gray-600">Click to upload product images</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                                </div>
                            </label>
                            <input
                                type="file"
                                id="uploadImageInput"
                                className="hidden"
                                onChange={handleUploadProduct}
                                accept="image/*"
                            />
                        </div>

                        {/* Display uploaded images */}
                        {data.productImage.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {data.productImage.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteProductImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Original Price *
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={data.price}
                                onChange={handleOnChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                                Selling Price *
                            </label>
                            <input
                                type="number"
                                id="sellingPrice"
                                name="sellingPrice"
                                value={data.sellingPrice}
                                onChange={handleOnChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleOnChange}
                            placeholder="Enter product description"
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-products')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
