import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import SummaryApi from '../common';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        status: 'ACTIVE'
    });
    const [showFilters, setShowFilters] = useState(false);

    const fetchProducts = useCallback(async (query = searchTerm) => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.allProduct.url);
            const result = await response.json();
            
            if (result.success) {
                let filteredProducts = result.data;

                // Apply search filter
                if (query.trim()) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.productName.toLowerCase().includes(query.toLowerCase()) ||
                        product.brandName.toLowerCase().includes(query.toLowerCase()) ||
                        product.category.toLowerCase().includes(query.toLowerCase()) ||
                        (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
                        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
                    );
                }

                // Apply additional filters
                if (filters.category) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.minPrice) {
                    filteredProducts = filteredProducts.filter(product =>
                        (product.sellingPrice || product.price) >= parseFloat(filters.minPrice)
                    );
                }

                if (filters.maxPrice) {
                    filteredProducts = filteredProducts.filter(product =>
                        (product.sellingPrice || product.price) <= parseFloat(filters.maxPrice)
                    );
                }

                if (filters.condition) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.condition === filters.condition
                    );
                }

                if (filters.status) {
                    filteredProducts = filteredProducts.filter(product =>
                        product.status === filters.status
                    );
                }

                setProducts(filteredProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters]);

    // Extract search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchTerm(query);
        fetchProducts(query);
    }, [location.search, fetchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        fetchProducts();
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            status: 'ACTIVE'
        });
        fetchProducts();
    };

    const uniqueCategories = [...new Set(products.map(p => p.category))];
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Searching products...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Search Header */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products by name, brand, category..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                        >
                            <FaSearch />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    >
                        <FaFilter />
                        Filters
                    </button>
                </form>

                {/* Results Info */}
                <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                        {searchTerm ? (
                            <>Found {products.length} results for "{searchTerm}"</>
                        ) : (
                            <>Showing {products.length} products</>
                        )}
                    </p>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Filters</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Price
                            </label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Price
                            </label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="1000"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Condition Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Condition
                            </label>
                            <select
                                value={filters.condition}
                                onChange={(e) => handleFilterChange('condition', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Conditions</option>
                                <option value="new">New</option>
                                <option value="like-new">Like New</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.productImage?.[0] || '/api/placeholder/300/300'}
                                    alt={product.productName}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                />
                            </div>
                            <div className="p-4">
                                <h3 
                                    className="font-semibold text-gray-800 mb-1 cursor-pointer hover:text-blue-600 line-clamp-2"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    {product.productName}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-red-600">
                                            ${product.sellingPrice || product.price}
                                        </p>
                                        {product.price && product.sellingPrice && product.price > product.sellingPrice && (
                                            <p className="text-sm text-gray-500 line-through">
                                                ${product.price}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        product.status === 'ACTIVE' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaSearch className="mx-auto text-6xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm 
                            ? `We couldn't find any products matching "${searchTerm}"`
                            : "No products match your current filters"
                        }
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            clearFilters();
                            navigate('/');
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse All Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
