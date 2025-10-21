import React, { useState } from 'react';
import { IoCloudUpload } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import imageTobase64 from '../helper/imageTobase64';
import productCategory from '../helper/productCategory';

const AddProduct = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: "",
        stock: "",
        condition: "new",
        location: "",
        tags: "",
        currency: "NGN"
    });

    const [uploadProductImageInput, setUploadProductImageInput] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (max 5MB per file)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size too large. Please upload images smaller than 5MB.");
                return;
            }
            
            // Check total number of images
            if (data.productImage.length >= 5) {
                toast.error("You can upload maximum 5 images per product.");
                return;
            }
            
            try {
                const uploadImageCloudinary = await imageTobase64(file);
                
                setData(prev => ({
                    ...prev,
                    productImage: [...prev.productImage, uploadImageCloudinary]
                }));
                
                toast.success("Image uploaded successfully!");
            } catch (error) {
                toast.error("Failed to process image. Please try again.");
                console.error("Image processing error:", error);
            }
        }
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
        
        if (!user?._id) {
            toast.error("Please login to add a product");
            navigate('/login');
            return;
        }

        // Check if user is admin (only admins can add products in single company model)
        if (user.role !== 'ADMIN') {
            toast.error("Only administrators can add products to the company store");
            navigate('/admin-panel');
            return;
        }

        if (!data.productName || !data.category || !data.price || !data.sellingPrice) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (data.productImage.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }

        try {
            const response = await fetch(SummaryApi.addProduct.url, {
                method: SummaryApi.addProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (responseData.success) {
                toast.success(responseData.message);
                setData({
                    productName: "",
                    brandName: "",
                    category: "",
                    productImage: [],
                    description: "",
                    price: "",
                    sellingPrice: "",
                    stock: "",
                    condition: "new",
                    location: "",
                    tags: "",
                    currency: "NGN"
                });
                // Navigate based on user role
                if (user.role === 'ADMIN') {
                    navigate('/admin-panel/all-products');
                } else {
                    navigate('/my-products');
                }
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            if (error.message.includes("fetch")) {
                toast.error("Network error. Please check your connection and try again.");
            } else if (error.message.includes("too large")) {
                toast.error("Images are too large. Please compress your images and try again.");
            } else {
                toast.error(error.message || "Failed to add product. Please try again.");
            }
        }
    };

    const conditions = [
        { value: "new", label: "New" },
        { value: "like-new", label: "Like New" },
        { value: "good", label: "Good" },
        { value: "fair", label: "Fair" },
        { value: "poor", label: "Poor" }
    ];

    return (
        <div className='p-4'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden mx-auto'>
                
                <div className='flex justify-between items-center pb-4'>
                    <h2 className='font-bold text-lg'>Add New Product</h2>
                    <button 
                        className='w-fit ml-auto block py-1 px-3 rounded-full hover:bg-red-600 text-red-600 hover:text-white'
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    
                    <label htmlFor='productName'>Product Name <span className='text-red-600'>*</span>:</label>
                    <input 
                        type='text' 
                        id='productName' 
                        placeholder='Enter product name' 
                        name='productName' 
                        value={data.productName} 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='brandName' className='mt-3'>Brand Name:</label>
                    <input 
                        type='text' 
                        id='brandName' 
                        placeholder='Enter brand name' 
                        value={data.brandName} 
                        name='brandName' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='category' className='mt-3'>Category <span className='text-red-600'>*</span>:</label>
                    <select 
                        required 
                        value={data.category} 
                        name='category' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="">Select Category</option>
                        {productCategory.map((el, index) => (
                            <option value={el.value} key={el.value + index}>{el.label}</option>
                        ))}
                    </select>

                    <label htmlFor='productImage' className='mt-3'>Product Images <span className='text-red-600'>*</span>:</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><IoCloudUpload/></span>
                                <p className='text-sm'>Upload Product Images</p>
                                <input 
                                    type='file' 
                                    id='uploadImageInput' 
                                    className='hidden' 
                                    onChange={handleUploadProduct}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </label>

                    <div>
                        {data?.productImage[0] ? (
                            <div className='flex items-center gap-2'>
                                {data.productImage.map((el, index) => (
                                    <div className='relative group' key={index}>
                                        <img 
                                            src={el} 
                                            alt={el} 
                                            width={80} 
                                            height={80} 
                                            className='bg-slate-100 border cursor-pointer' 
                                            onClick={() => {
                                                setUploadProductImageInput(el)
                                            }}
                                        />
                                        <div 
                                            className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' 
                                            onClick={() => handleDeleteProductImage(index)}
                                        >
                                            <MdDelete/>  
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload at least one product image</p>
                        )}
                    </div>

                    <label htmlFor='currency' className='mt-3'>Currency <span className='text-red-600'>*</span>:</label>
                    <select 
                        required 
                        value={data.currency} 
                        name='currency' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="NGN">₦ Nigerian Naira (NGN)</option>
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                        <option value="GBP">£ British Pound (GBP)</option>
                        <option value="ZAR">R South African Rand (ZAR)</option>
                        <option value="EGP">E£ Egyptian Pound (EGP)</option>
                        <option value="KES">Ksh Kenyan Shilling (KES)</option>
                        <option value="GHS">₵ Ghanaian Cedi (GHS)</option>
                        <option value="MAD">MAD Moroccan Dirham (MAD)</option>
                        <option value="ETB">Br Ethiopian Birr (ETB)</option>
                        <option value="CAD">C$ Canadian Dollar (CAD)</option>
                        <option value="AUD">A$ Australian Dollar (AUD)</option>
                        <option value="JPY">¥ Japanese Yen (JPY)</option>
                        <option value="CNY">¥ Chinese Yuan (CNY)</option>
                        <option value="INR">₹ Indian Rupee (INR)</option>
                        <option value="BRL">R$ Brazilian Real (BRL)</option>
                    </select>

                    <label htmlFor='price' className='mt-3'>Original Price <span className='text-red-600'>*</span>:</label>
                    <div className='relative'>
                        <input 
                            type='number' 
                            id='price' 
                            placeholder={`Enter original price in ${data.currency}`}
                            value={data.price} 
                            name='price' 
                            onChange={handleOnChange}
                            className='p-2 bg-slate-100 border rounded w-full'
                            required
                        />
                    </div>

                    <label htmlFor='sellingPrice' className='mt-3'>Selling Price <span className='text-red-600'>*</span>:</label>
                    <div className='relative'>
                        <input 
                            type='number' 
                            id='sellingPrice' 
                            placeholder={`Enter selling price in ${data.currency}`}
                            value={data.sellingPrice} 
                            name='sellingPrice' 
                            onChange={handleOnChange}
                            className='p-2 bg-slate-100 border rounded w-full'
                            required
                        />
                    </div>
                    
                    <p className='text-sm text-gray-600 mt-1'>
                        Prices will be converted to other currencies automatically for international buyers.
                    </p>

                    <label htmlFor='stock' className='mt-3'>Stock Quantity:</label>
                    <input 
                        type='number' 
                        id='stock' 
                        placeholder='Enter stock quantity' 
                        value={data.stock} 
                        name='stock' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        min="1"
                    />

                    <label htmlFor='condition' className='mt-3'>Condition:</label>
                    <select 
                        value={data.condition} 
                        name='condition' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        {conditions.map((condition) => (
                            <option value={condition.value} key={condition.value}>
                                {condition.label}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='location' className='mt-3'>Location:</label>
                    <input 
                        type='text' 
                        id='location' 
                        placeholder='Enter your location' 
                        value={data.location} 
                        name='location' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='tags' className='mt-3'>Tags (comma separated):</label>
                    <input 
                        type='text' 
                        id='tags' 
                        placeholder='Enter tags separated by commas' 
                        value={data.tags} 
                        name='tags' 
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='description' className='mt-3'>Description:</label>
                    <textarea 
                        className='h-28 bg-slate-100 border resize-none p-1' 
                        placeholder='Enter product description' 
                        rows={3} 
                        onChange={handleOnChange} 
                        name='description'
                        value={data.description}
                    >
                    </textarea>

                    <button 
                        className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 rounded'
                        type='submit'
                    >
                        Add Product
                    </button>
                </form>
            </div>

            {/* Display Image full screen */}
            {uploadProductImageInput && (
                <div className='absolute bottom-0 top-0 right-0 left-0 flex justify-center items-center bg-slate-200 bg-opacity-80' onClick={() => setUploadProductImageInput("")}>
                    <div className='bg-white p-4 max-w-5xl mx-auto'>
                        <img src={uploadProductImageInput} className='w-full h-full max-w-[80vh] max-h-[80vh] object-scale-down mix-blend-multiply' alt=""/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduct;
