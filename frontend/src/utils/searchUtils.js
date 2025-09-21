// Simple debounce utility function
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

// Throttle function for performance optimization
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Search analytics helper
export const trackSearchEvent = (query, resultsCount, filters = {}) => {
    if (window.gtag) {
        window.gtag('event', 'search', {
            search_term: query,
            results_count: resultsCount,
            filters_applied: Object.keys(filters).length > 0,
            custom_parameters: {
                has_filters: Object.keys(filters).length > 0,
                filter_types: Object.keys(filters).join(',')
            }
        });
    }
};

// Format search results for analytics
export const formatSearchResults = (products, searchTerm, filters) => {
    return {
        total: products.length,
        categories: [...new Set(products.map(p => p.category))],
        priceRange: {
            min: Math.min(...products.map(p => p.sellingPrice || p.price || 0)),
            max: Math.max(...products.map(p => p.sellingPrice || p.price || 0))
        },
        searchTerm,
        filtersApplied: filters
    };
};

// Highlight search terms in text
export const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>');
};

// Clean and normalize search query
export const normalizeSearchQuery = (query) => {
    return query
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Remove special characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
};

// Generate search suggestions based on query
export const generateSearchSuggestions = (query, products, maxSuggestions = 8) => {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = normalizeSearchQuery(query);
    const suggestions = new Set();
    
    products.forEach(product => {
        // Product name matches
        if (product.productName?.toLowerCase().includes(normalizedQuery)) {
            suggestions.add(product.productName);
        }
        
        // Brand name matches
        if (product.brandName?.toLowerCase().includes(normalizedQuery)) {
            suggestions.add(product.brandName);
        }
        
        // Category matches
        if (product.category?.toLowerCase().includes(normalizedQuery)) {
            suggestions.add(product.category);
        }
        
        // Tag matches
        if (product.tags && Array.isArray(product.tags)) {
            product.tags.forEach(tag => {
                if (tag.toLowerCase().includes(normalizedQuery)) {
                    suggestions.add(tag);
                }
            });
        }
    });
    
    return Array.from(suggestions)
        .slice(0, maxSuggestions)
        .map(suggestion => ({
            text: suggestion,
            type: 'product'
        }));
};