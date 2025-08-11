import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SummaryApi from '../common';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [error, setError] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('NGN');

  // Cache products for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Load user's preferred currency on mount
  useEffect(() => {
    const loadUserCurrency = async () => {
      try {
        const response = await fetch(SummaryApi.getUserPreferences.url, {
          method: SummaryApi.getUserPreferences.method,
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.currency) {
            setCurrentCurrency(data.data.currency);
          }
        }
      } catch (error) {
        console.log('Could not load user currency preferences:', error);
        // Fallback to localStorage or default
        const savedCurrency = localStorage.getItem('userCurrency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    };
    
    loadUserCurrency();
  }, []);

  const fetchAllProducts = useCallback(async (forceRefresh = false, currency = null) => {
    // Get user's preferred currency
    const userCurrency = currency || currentCurrency;
    
    // Check if we have recent data and don't need to refetch
    if (!forceRefresh && allProducts.length > 0 && lastFetch && 
        (Date.now() - lastFetch < CACHE_DURATION)) {
      return allProducts;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add currency parameter to API call
      const url = new URL(SummaryApi.allProduct.url);
      if (userCurrency) {
        url.searchParams.append('currency', userCurrency);
      }
      
      const response = await fetch(url.toString(), {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllProducts(dataResponse.data);
        setLastFetch(Date.now());
        if (dataResponse.currency) {
          setCurrentCurrency(dataResponse.currency);
        }
        return dataResponse.data;
      } else {
        setError(dataResponse.message || 'Failed to fetch products');
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [allProducts, lastFetch, CACHE_DURATION, currentCurrency]);

  const getProductsByCategory = useCallback((category) => {
    if (!category || category === 'all') {
      return allProducts;
    }
    
    return allProducts.filter(product => 
      product.category?.toLowerCase() === category?.toLowerCase()
    );
  }, [allProducts]);

  const getProductById = useCallback((id) => {
    return allProducts.find(product => product._id === id);
  }, [allProducts]);

  // Auto-fetch on mount and when currency changes
  useEffect(() => {
    if (allProducts.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, allProducts.length]);

  const changeCurrency = useCallback(async (newCurrency) => {
    if (newCurrency !== currentCurrency) {
      setCurrentCurrency(newCurrency);
      
      // Save to localStorage for immediate persistence
      localStorage.setItem('userCurrency', newCurrency);
      
      // Save to database
      try {
        await fetch(SummaryApi.updateUserPreferences.url, {
          method: SummaryApi.updateUserPreferences.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currency: newCurrency
          })
        });
      } catch (error) {
        console.log('Could not save currency preference to database:', error);
      }
      
      // Refresh products with new currency
      fetchAllProducts(true, newCurrency);
    }
  }, [currentCurrency, fetchAllProducts]);

  const value = {
    allProducts,
    loading,
    error,
    currentCurrency,
    fetchAllProducts,
    getProductsByCategory,
    getProductById,
    changeCurrency,
    refreshProducts: () => fetchAllProducts(true)
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
