import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaSort, FaList, FaTh, FaChevronDown } from 'react-icons/fa';
import SmartSearchBar from '../components/SmartSearchBar';
import { trackSearchEvent } from '../utils/searchUtils';
import SummaryApi from '../common';

const EnhancedSearchResults = () => {
    console.log('🔍 EnhancedSearchResults component loaded at:', new Date().toISOString());
    
    const location = useLocation();
    const navigate = useNavigate();
    
    // Search state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filter state
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        inStock: true,
        sortBy: 'relevance'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [availableFilters, setAvailableFilters] = useState({
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 1000 }
    });
    
    // UI state
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    // Sort options
    const sortOptions = [
        { value: 'relevance', label: 'Relevance', icon: '🎯' },
        { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
        { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
        { value: 'newest', label: 'Newest First', icon: '🆕' },
        { value: 'rating', label: 'Highest Rated', icon: '⭐' },
        { value: 'popular', label: 'Most Popular', icon: '🔥' }
    ];

    // Fetch search filters data
    const fetchFilters = useCallback(async () => {
        try {
            const response = await fetch(SummaryApi.searchFilters.url);
            const data = await response.json();
            
            if (data.success) {
                setAvailableFilters(data.filters);
            }
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    }, []);

    // Enhanced search function
    const performSearch = useCallback(async (query = searchTerm, page = 1, searchFilters = filters) => {
        try {
            console.log('🔍 performSearch called:', { query, page, searchFilters });
            setLoading(true);
            
            const searchParams = new URLSearchParams({
                q: query || '', // Allow empty query to show all products
                page: page.toString(),
                limit: '20',
                sortBy: searchFilters.sortBy,
                inStock: searchFilters.inStock.toString()
            });

            // Add filter parameters
            if (searchFilters.category) searchParams.append('category', searchFilters.category);
            if (searchFilters.brand) searchParams.append('brand', searchFilters.brand);
            if (searchFilters.minPrice) searchParams.append('minPrice', searchFilters.minPrice);
            if (searchFilters.maxPrice) searchParams.append('maxPrice', searchFilters.maxPrice);

            const searchUrl = `${SummaryApi.baseURL}/api/search/smart?${searchParams}`;
            console.log('🔍 Making search request to:', searchUrl);

            const response = await fetch(searchUrl);
            const data = await response.json();
            
            console.log('🔍 Search response:', { status: response.status, data });
            
            if (data.success) {
                setProducts(data.data || []);
                setTotalResults(data.pagination?.totalProducts || 0);
                setTotalPages(data.pagination?.totalPages || 1);
                setCurrentPage(data.pagination?.currentPage || 1);
                
                console.log('🔍 Search successful:', { 
                    productsCount: data.data?.length, 
                    totalResults: data.pagination?.totalProducts 
                });
                
                // Track search analytics
                trackSearchEvent(query, data.pagination?.totalProducts || 0, searchFilters);
            } else {
                console.log('🔍 Search failed:', data.message);
                setProducts([]);
                setTotalResults(0);
            }
        } catch (error) {
            console.error('Error performing search:', error);
            setProducts([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters]);

    // Initialize from URL parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        const category = params.get('category') || '';
        const brand = params.get('brand') || '';
        const minPrice = params.get('minPrice') || '';
        const maxPrice = params.get('maxPrice') || '';
        const page = parseInt(params.get('page')) || 1;
        
        setSearchTerm(query);
        setCurrentPage(page);
        
        setFilters(prev => ({
            ...prev,
            category,
            brand,
            minPrice,
            maxPrice
        }));
        
        fetchFilters();
    }, [location.search, fetchFilters]);

    // Perform search when dependencies change
    useEffect(() => {
        console.log('🔍 Search useEffect triggered:', { searchTerm, category: filters.category, currentPage });
        // Always perform search - if no search term, show all products
        performSearch(searchTerm, currentPage, filters);
    }, [searchTerm, currentPage, filters, performSearch]);

    // Handle search from SmartSearchBar
    const handleSearch = (query) => {
        setSearchTerm(query);
        setCurrentPage(1);
        
        const params = new URLSearchParams(location.search);
        params.set('q', query);
        params.set('page', '1');
        
        navigate(`/search?${params.toString()}`);
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        setCurrentPage(1);
        
        // Update URL
        const params = new URLSearchParams(location.search);
        if (value) {
            params.set(filterType, value);
        } else {
            params.delete(filterType);
        }
        params.set('page', '1');
        
        navigate(`/search?${params.toString()}`, { replace: true });
    };

    // Clear all filters
    const clearFilters = () => {
        const clearedFilters = {
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            inStock: true,
            sortBy: 'relevance'
        };
        setFilters(clearedFilters);
        setCurrentPage(1);
        
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        params.set('page', '1');
        
        navigate(`/search?${params.toString()}`, { replace: true });
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());
        navigate(`/search?${params.toString()}`, { replace: true });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border ${
                            page === currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        );
    };

    if (loading && products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-lg text-gray-600">Searching products...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Enhanced Search Header */}
            <div className="mb-6">
                <SmartSearchBar
                    onSearch={handleSearch}
                    placeholder="Search products, brands, categories..."
                    className="mb-4"
                />

                {/* Search Results Info */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600">
                            {searchTerm ? (
                                <>
                                    <span className="font-medium">{totalResults}</span> results for "
                                    <span className="font-medium text-blue-600">{searchTerm}</span>"
                                </>
                            ) : (
                                <>Showing <span className="font-medium">{totalResults}</span> products</>
                            )}
                        </p>
                        
                        {totalResults > 0 && (
                            <span className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </span>
                        )}
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <FaSort className="text-gray-500" />
                                <span className="text-sm">
                                    {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
                                </span>
                                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${
                                    sortDropdownOpen ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {sortDropdownOpen && (
                                <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleFilterChange('sortBy', option.value);
                                                setSortDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                                                filters.sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                            }`}
                                        >
                                            <span>{option.icon}</span>
                                            <span className="text-sm">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 text-sm ${
                                    viewMode === 'grid' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FaTh />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 text-sm ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            <FaFilter />
                            <span className="text-sm">Filters</span>
                            {Object.values(filters).some(v => v && v !== 'relevance' && v !== true) && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Filters - Show automatically when there are results */}
                {totalResults > 0 && (
                    <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
                            
                            {/* Category Quick Filters */}
                            <div className="flex flex-wrap gap-2">
                                {availableFilters.categories.slice(0, 6).map(category => (
                                    <button
                                        key={category}
                                        onClick={() => handleFilterChange('category', filters.category === category ? '' : category)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                            filters.category === category
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>

                            {/* Price Range Quick Filters */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        handleFilterChange('minPrice', '');
                                        handleFilterChange('maxPrice', '1000');
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                        filters.maxPrice === '1000'
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    Under ₦1,000
                                </button>
                                <button
                                    onClick={() => {
                                        handleFilterChange('minPrice', '1000');
                                        handleFilterChange('maxPrice', '5000');
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                        filters.minPrice === '1000' && filters.maxPrice === '5000'
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    ₦1,000 - ₦5,000
                                </button>
                                <button
                                    onClick={() => {
                                        handleFilterChange('minPrice', '5000');
                                        handleFilterChange('maxPrice', '');
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                        filters.minPrice === '5000'
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    Over ₦5,000
                                </button>
                            </div>

                            {/* Advanced Filters Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50"
                            >
                                <FaFilter className="text-xs" />
                                More Filters
                            </button>

                            {/* Clear Filters */}
                            {Object.values(filters).some(v => v && v !== 'relevance' && v !== true) && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50"
                                >
                                    <FaTimes className="text-xs" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Filter Results</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-200"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {availableFilters.categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price
                            </label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder={`Min $${availableFilters.priceRange.min}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price
                            </label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder={`Max $${availableFilters.priceRange.max}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Stock Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Availability
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.inStock}
                                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">In Stock Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Brand Filter Section */}
                    {availableFilters.brands.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-800 mb-3">Brands</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {availableFilters.brands.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => handleFilterChange('brand', filters.brand === brand ? '' : brand)}
                                        className={`px-3 py-2 text-sm text-left rounded-lg border transition-colors ${
                                            filters.brand === brand
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Apply Filters Button */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setShowFilters(false)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                // Trigger search with current filters
                                performSearch(searchTerm, 1, filters);
                                setShowFilters(false);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Results Display */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : products.length > 0 ? (
                <>
                    {/* Products Grid/List */}
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' 
                            : 'space-y-4'
                    }`}>
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                                    viewMode === 'list' ? 'flex items-center p-4 gap-4' : ''
                                }`}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                {/* Product Image */}
                                <div className={`${
                                    viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'
                                } overflow-hidden`}>
                                    <img
                                        src={product.productImage?.[0] || '/api/placeholder/300/300'}
                                        alt={product.productName}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-blue-600">
                                        {product.productName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                                    
                                    {/* Price and Discount */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-red-600">
                                                ${product.sellingPrice || product.price}
                                            </p>
                                            {product.price && product.sellingPrice && product.price > product.sellingPrice && (
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-gray-500 line-through">
                                                        ${product.price}
                                                    </p>
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                        {Math.round(((product.price - product.sellingPrice) / product.price) * 100)}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Status Badge */}
                                        <span className={`px-2 py-1 text-xs rounded ${
                                            product.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </div>

                                    {/* Rating (if available) */}
                                    {product.reviews?.averageRating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="text-yellow-500">⭐</span>
                                            <span className="text-sm text-gray-600">
                                                {product.reviews.averageRating.toFixed(1)} 
                                                ({product.reviews.count} reviews)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {renderPagination()}
                </>
            ) : (
                /* No Results */
                <div className="text-center py-16">
                    <FaSearch className="mx-auto text-6xl text-gray-400 mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">No products found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {searchTerm 
                            ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search or filters.`
                            : "No products match your current filters. Try adjusting your criteria."
                        }
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={clearFilters}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Browse All Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedSearchResults;