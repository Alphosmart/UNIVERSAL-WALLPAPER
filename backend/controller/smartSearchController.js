const Product = require('../models/productModel');

// Smart search controller with advanced features
const smartSearch = async (req, res) => {
    try {
        const { 
            q: searchTerm, 
            category, 
            minPrice, 
            maxPrice, 
            sortBy = 'relevance',
            page = 1,
            limit = 20,
            inStock = true
        } = req.query;

        let query = {};
        let sortOptions = {};

        // Text search with MongoDB full-text search
        if (searchTerm && searchTerm.trim()) {
            const searchRegex = new RegExp(searchTerm.trim(), 'i');
            
            query.$or = [
                { productName: searchRegex },
                { brandName: searchRegex },
                { category: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];

            // Add text score for relevance sorting
            if (sortBy === 'relevance') {
                query.$text = { $search: searchTerm.trim() };
                sortOptions = { score: { $meta: 'textScore' } };
            }
        }

        // Category filter
        if (category && category !== 'all') {
            query.category = new RegExp(category, 'i');
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.$expr = {
                $and: []
            };
            
            const priceField = {
                $ifNull: ['$sellingPrice', '$price']
            };

            if (minPrice) {
                query.$expr.$and.push({
                    $gte: [priceField, parseFloat(minPrice)]
                });
            }

            if (maxPrice) {
                query.$expr.$and.push({
                    $lte: [priceField, parseFloat(maxPrice)]
                });
            }
        }

        // Stock filter
        if (inStock === 'true') {
            query.status = 'ACTIVE';
        }

        // Sorting options
        switch (sortBy) {
            case 'price-low':
                sortOptions = { 
                    $expr: { 
                        $ifNull: ['$sellingPrice', '$price'] 
                    } 
                };
                break;
            case 'price-high':
                sortOptions = { 
                    $expr: { 
                        $ifNull: ['$sellingPrice', '$price'] 
                    } 
                };
                sortOptions = { ...sortOptions, order: -1 };
                break;
            case 'newest':
                sortOptions = { createdAt: -1 };
                break;
            case 'rating':
                sortOptions = { 'reviews.averageRating': -1 };
                break;
            case 'popular':
                sortOptions = { 'analytics.views': -1, 'analytics.purchases': -1 };
                break;
            default:
                if (!searchTerm) {
                    sortOptions = { createdAt: -1 };
                }
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute search with aggregation for better performance
        const aggregationPipeline = [
            { $match: query },
            {
                $addFields: {
                    effectivePrice: { $ifNull: ['$sellingPrice', '$price'] },
                    discountPercentage: {
                        $cond: {
                            if: { $and: ['$price', '$sellingPrice'] },
                            then: {
                                $multiply: [
                                    { $divide: [
                                        { $subtract: ['$price', '$sellingPrice'] },
                                        '$price'
                                    ] },
                                    100
                                ]
                            },
                            else: 0
                        }
                    }
                }
            },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ];

        const [products, totalCount] = await Promise.all([
            Product.aggregate(aggregationPipeline),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / parseInt(limit)),
                totalProducts: totalCount,
                hasNext: skip + parseInt(limit) < totalCount,
                hasPrev: parseInt(page) > 1
            },
            searchInfo: {
                query: searchTerm,
                resultsFound: totalCount,
                sortBy,
                filters: {
                    category,
                    priceRange: { min: minPrice, max: maxPrice },
                    inStock
                }
            }
        });

    } catch (error) {
        console.error('Smart search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing search',
            error: error.message
        });
    }
};

// Search suggestions/autocomplete
const getSearchSuggestions = async (req, res) => {
    try {
        const { q: searchTerm } = req.query;
        
        if (!searchTerm || searchTerm.length < 2) {
            return res.json({
                success: true,
                suggestions: []
            });
        }

        const searchRegex = new RegExp(searchTerm.trim(), 'i');
        
        // Get categorized suggestions with better organization
        const suggestionData = await Product.aggregate([
            {
                $match: {
                    status: 'ACTIVE',
                    $or: [
                        { productName: searchRegex },
                        { brandName: searchRegex },
                        { category: searchRegex }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    productNames: { $addToSet: '$productName' },
                    brandNames: { $addToSet: '$brandName' },
                    categories: { $addToSet: '$category' }
                }
            }
        ]);

        const data = suggestionData[0] || { productNames: [], brandNames: [], categories: [] };
        
        // Create categorized suggestions with priorities
        const suggestions = [];
        
        // 1. Categories first (highest priority) - limited to top 3
        const matchingCategories = (data.categories || [])
            .filter(cat => cat && cat.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 3)
            .map(category => ({
                text: category,
                type: 'category',
                priority: 1
            }));
        
        // 2. Brand names - limited to top 3  
        const matchingBrands = (data.brandNames || [])
            .filter(brand => brand && brand.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 3)
            .map(brand => ({
                text: brand,
                type: 'brand', 
                priority: 2
            }));
        
        // 3. Product names - limited to top 4
        const matchingProducts = (data.productNames || [])
            .filter(product => product && product.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 4)
            .map(product => ({
                text: product,
                type: 'product',
                priority: 3
            }));

        // Combine and sort by priority, then alphabetically
        const allSuggestions = [...matchingCategories, ...matchingBrands, ...matchingProducts]
            .sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                return a.text.localeCompare(b.text);
            })
            .slice(0, 8); // Limit total suggestions
        
        // Add some default popular categories if no matches found
        if (allSuggestions.length === 0 && searchTerm.length >= 2) {
            const popularCategories = [
                'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 
                'Children\'s Room', 'Dining Room', 'Hallway'
            ];
            
            const matchingPopular = popularCategories
                .filter(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 4)
                .map(category => ({
                    text: category,
                    type: 'category',
                    priority: 1
                }));
                
            allSuggestions.push(...matchingPopular);
        }

        res.json({
            success: true,
            suggestions: allSuggestions
        });

    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting suggestions',
            error: error.message
        });
    }
};

// Popular searches
const getPopularSearches = async (req, res) => {
    try {
        // Get popular categories and products
        const popularData = await Product.aggregate([
            { $match: { status: 'ACTIVE' } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgViews: { $avg: '$analytics.views' }
                }
            },
            { $sort: { count: -1, avgViews: -1 } },
            { $limit: 6 },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            success: true,
            popularSearches: popularData.map(item => item.category)
        });

    } catch (error) {
        console.error('Popular searches error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting popular searches',
            error: error.message
        });
    }
};

// Search filters data
const getSearchFilters = async (req, res) => {
    try {
        const filtersData = await Product.aggregate([
            { $match: { status: 'ACTIVE' } },
            {
                $group: {
                    _id: null,
                    categories: { $addToSet: '$category' },
                    brands: { $addToSet: '$brandName' },
                    priceRange: {
                        $push: {
                            $ifNull: ['$sellingPrice', '$price']
                        }
                    }
                }
            },
            {
                $project: {
                    categories: { $sortArray: { input: '$categories', sortBy: 1 } },
                    brands: { $sortArray: { input: '$brands', sortBy: 1 } },
                    minPrice: { $min: '$priceRange' },
                    maxPrice: { $max: '$priceRange' }
                }
            }
        ]);

        const filters = filtersData[0] || {
            categories: [],
            brands: [],
            minPrice: 0,
            maxPrice: 1000
        };

        res.json({
            success: true,
            filters: {
                categories: filters.categories,
                brands: filters.brands.slice(0, 20), // Limit brands for performance
                priceRange: {
                    min: Math.floor(filters.minPrice || 0),
                    max: Math.ceil(filters.maxPrice || 1000)
                }
            }
        });

    } catch (error) {
        console.error('Search filters error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting filters',
            error: error.message
        });
    }
};

module.exports = {
    smartSearch,
    getSearchSuggestions,
    getPopularSearches,
    getSearchFilters
};