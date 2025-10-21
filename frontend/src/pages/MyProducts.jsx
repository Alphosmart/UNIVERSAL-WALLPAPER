import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MdEdit, MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const MyProducts = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Check admin access
    useEffect(() => {
        if (!user?._id) {
            navigate('/login');
            return;
        }
        
        if (user.role !== 'ADMIN') {
            toast.error("Only administrators can manage company products");
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const fetchUserProducts = useCallback(async () => {
        if (!user?._id || user.role !== 'ADMIN') {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getUserProducts.url, {
                method: SummaryApi.getUserProducts.method,
                credentials: 'include',
            });

            const responseData = await response.json();

            if (responseData.success) {
                setProducts(responseData.data);
            } else {
                toast.error(responseData.message);
                if (response.status === 403) {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch company products");
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.role, navigate]);

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(SummaryApi.deleteProduct.url.replace(':productId', productId), {
                    method: SummaryApi.deleteProduct.method,
                    credentials: 'include',
                });

                const responseData = await response.json();

                if (responseData.success) {
                    toast.success(responseData.message);
                    // Refresh the list by calling fetchUserProducts again
                    if (user?._id) {
                        setLoading(true);
                        try {
                            const refreshResponse = await fetch(SummaryApi.getUserProducts.url, {
                                method: SummaryApi.getUserProducts.method,
                                credentials: 'include',
                            });
                            const refreshData = await refreshResponse.json();
                            if (refreshData.success) {
                                setProducts(refreshData.data);
                            }
                        } catch (error) {
                            console.error("Error refreshing products:", error);
                        } finally {
                            setLoading(false);
                        }
                    }
                } else {
                    toast.error(responseData.message);
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    useEffect(() => {
        fetchUserProducts();
    }, [fetchUserProducts]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'SOLD':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getConditionBadge = (condition) => {
        const colors = {
            'new': 'bg-blue-100 text-blue-800',
            'like-new': 'bg-green-100 text-green-800',
            'good': 'bg-yellow-100 text-yellow-800',
            'fair': 'bg-orange-100 text-orange-800',
            'poor': 'bg-red-100 text-red-800'
        };
        return colors[condition] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className='bg-white pb-4'>
            <div className='container mx-auto p-4'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-slate-700'>Company Products</h2>
                    <Link 
                        to='/add-product'
                        className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
                    >
                        <IoMdAdd className='text-lg' />
                        Add New Product
                    </Link>
                </div>

                {products.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-slate-400 mb-4'>
                            <IoMdAdd className='text-6xl mx-auto mb-4' />
                            <h3 className='text-xl font-semibold mb-2'>No products in store yet</h3>
                            <p className='text-gray-600 mb-4'>Add products to the company store</p>
                            <Link 
                                to='/add-product'
                                className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-block transition-colors'
                            >
                                Add First Product
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {products.map((product) => (
                            <div key={product._id} className='bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow'>
                                <div className='relative'>
                                    <img 
                                        src={product.productImage[0] || '/api/placeholder/300/200'} 
                                        alt={product.productName}
                                        className='w-full h-48 object-cover'
                                    />
                                    <div className='absolute top-2 left-2'>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </div>
                                    <div className='absolute top-2 right-2'>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(product.condition)}`}>
                                            {product.condition}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className='p-4'>
                                    <h3 className='font-semibold text-lg mb-2 line-clamp-2'>{product.productName}</h3>
                                    {product.brandName && (
                                        <p className='text-gray-600 text-sm mb-2'>{product.brandName}</p>
                                    )}
                                    
                                    <div className='flex justify-between items-center mb-2'>
                                        <div>
                                            <span className='text-red-600 font-bold text-lg'>
                                                {formatPrice(product.sellingPrice)}
                                            </span>
                                            {product.price !== product.sellingPrice && (
                                                <span className='text-gray-500 text-sm line-through ml-2'>
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                        <span className='text-gray-600 text-sm'>
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    {product.location && (
                                        <p className='text-gray-600 text-sm mb-3'>📍 {product.location}</p>
                                    )}

                                    <div className='flex justify-between items-center mt-4'>
                                        <span className='text-gray-500 text-xs'>
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className='flex gap-2'>
                                            <button 
                                                className='p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                                                onClick={() => navigate(`/admin-panel/edit-product/${product._id}`)}
                                                title="Edit Product"
                                            >
                                                <MdEdit />
                                            </button>
                                            <button 
                                                className='p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
                                                onClick={() => handleDeleteProduct(product._id)}
                                                title="Delete Product"
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProducts;
