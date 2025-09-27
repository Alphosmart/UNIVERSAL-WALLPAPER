import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSearch, FaTimes, FaHistory, FaFire, FaTag, FaStore, FaLayerGroup } from 'react-icons/fa';
import { debounce } from '../utils/searchUtils';
import SummaryApi from '../common';

const SmartSearchBar = ({ 
    onSearch, 
    placeholder = "Search products, brands, categories...", 
    showSuggestions = true,
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [popularSearches, setPopularSearches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [searchHistory, setSearchHistory] = useState([]);
    
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    // Load search history from localStorage
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
    }, []);

    // Debounced function to fetch suggestions
    const debouncedFetchSuggestions = useCallback((query) => {
        const fetchSuggestions = debounce(async (searchQuery) => {
            if (!searchQuery || searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    `${SummaryApi.baseURL}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`
                );
                const data = await response.json();
                
                if (data.success) {
                    setSuggestions(data.suggestions || []);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        fetchSuggestions(query);
    }, []);

    // Fetch popular searches
    useEffect(() => {
        const fetchPopularSearches = async () => {
            try {
                const response = await fetch(`${SummaryApi.baseURL}/api/search/popular`);
                const data = await response.json();
                
                if (data.success) {
                    setPopularSearches(data.popularSearches || []);
                }
            } catch (error) {
                console.error('Error fetching popular searches:', error);
            }
        };

        fetchPopularSearches();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedIndex(-1);
        
        if (showSuggestions) {
            debouncedFetchSuggestions(value);
            setShowDropdown(true);
        }
    };

    // Handle search submission
    const handleSearch = (term = searchTerm) => {
        if (!term.trim()) return;

        const finalTerm = term.trim();
        
        // Add to search history
        const newHistory = [finalTerm, ...searchHistory.filter(h => h !== finalTerm)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        
        // Perform search
        onSearch(finalTerm);
        setShowDropdown(false);
        setSearchTerm(finalTerm);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const allSuggestions = [
            ...suggestions,
            ...searchHistory.map(h => ({ text: h, type: 'history' })),
            ...popularSearches.map(p => ({ text: p, type: 'popular' }))
        ];

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < allSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
                    handleSearch(allSuggestions[selectedIndex].text);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
            default:
                // No action needed for other keys
                break;
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedIndex(-1);
        searchRef.current?.focus();
    };

    // Clear search history
    const removeFromHistory = (term) => {
        const newHistory = searchHistory.filter(h => h !== term);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // Get icon for suggestion type
    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'category':
                return <FaLayerGroup className="text-blue-500 text-sm" />;
            case 'brand':
                return <FaStore className="text-green-500 text-sm" />;
            case 'product':
                return <FaTag className="text-purple-500 text-sm" />;
            default:
                return <FaSearch className="text-gray-400 text-sm" />;
        }
    };

    // Get suggestion label
    const getSuggestionLabel = (type) => {
        switch (type) {
            case 'category':
                return 'Category';
            case 'brand':
                return 'Brand';
            case 'product':
                return 'Product';
            default:
                return '';
        }
    };

    return (
        <div className={`relative w-full max-w-2xl ${className}`} ref={dropdownRef}>
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => showSuggestions && setShowDropdown(true)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pl-12 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <FaSearch className="text-blue-500" size={16} />
                </div>
                
                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>
                )}
                
                {/* Loading Indicator */}
                {loading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && showSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="p-2">
                            <div className="text-xs font-semibold text-gray-500 px-3 py-1 mb-1">
                                Suggestions
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={`suggestion-${index}`}
                                    onClick={() => handleSearch(suggestion.text)}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3 group ${
                                        selectedIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                    }`}
                                >
                                    {getSuggestionIcon(suggestion.type)}
                                    <div className="flex-1">
                                        <span className="block">
                                            {suggestion.text}
                                        </span>
                                        {suggestion.type !== 'product' && (
                                            <span className="text-xs text-gray-400 group-hover:text-gray-500">
                                                {getSuggestionLabel(suggestion.type)}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                        <div className="p-2 border-t border-gray-100">
                            <div className="text-xs font-semibold text-gray-500 px-3 py-1 mb-1 flex items-center gap-1">
                                <FaHistory className="text-xs" />
                                Recent Searches
                            </div>
                            {searchHistory.map((term, index) => (
                                <div
                                    key={`history-${index}`}
                                    className={`group flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${
                                        selectedIndex === suggestions.length + index ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <FaHistory className="text-gray-400 text-sm" />
                                    <button
                                        onClick={() => handleSearch(term)}
                                        className="flex-1 text-left text-gray-600 hover:text-gray-800"
                                    >
                                        {term}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromHistory(term);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Popular Searches */}
                    {popularSearches.length > 0 && searchTerm.length < 2 && (
                        <div className="p-2 border-t border-gray-100">
                            <div className="text-xs font-semibold text-gray-500 px-3 py-1 mb-1 flex items-center gap-1">
                                <FaFire className="text-orange-500 text-xs" />
                                Popular Searches
                            </div>
                            {popularSearches.map((term, index) => (
                                <button
                                    key={`popular-${index}`}
                                    onClick={() => handleSearch(term)}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 flex items-center gap-3 ${
                                        selectedIndex === suggestions.length + searchHistory.length + index ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <FaFire className="text-orange-500 text-sm" />
                                    <span className="text-gray-600 hover:text-gray-800">
                                        {term}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {suggestions.length === 0 && searchHistory.length === 0 && popularSearches.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            <FaSearch className="mx-auto text-2xl mb-2 opacity-50" />
                            <p>Start typing to see suggestions</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartSearchBar;