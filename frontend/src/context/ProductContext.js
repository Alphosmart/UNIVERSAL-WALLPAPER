import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
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
  console.log('🔍 ProductProvider: Initializing at', new Date().toISOString());
  
  const user = useSelector(state => state?.user?.user);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const [error, setError] = useState(null);
  const allProductsRef = useRef([]);
  const [currentCurrency, setCurrentCurrency] = useState('NGN');

  console.log('🔍 ProductProvider: Initial state set. User:', user?.name || 'Not logged in');

  // Cache products for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  // Load user's preferred currency on mount
  useEffect(() => {
    const loadUserCurrency = async () => {
      // Only fetch user preferences if user is authenticated
      if (!user || !user._id) {
        // Fallback to localStorage or default for unauthenticated users
        const savedCurrency = localStorage.getItem('userCurrency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
        return;
      }

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
        } else if (response.status === 401) {
          // User is no longer authenticated, fallback to localStorage
          const savedCurrency = localStorage.getItem('userCurrency');
          if (savedCurrency) {
            setCurrentCurrency(savedCurrency);
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
  }, [user]);

  const fetchAllProducts = useCallback(async (forceRefresh = false, currency = null) => {
    console.log('🔍 ProductContext: fetchAllProducts called', { forceRefresh, currency, currentProducts: allProductsRef.current.length });
    
    // Get user's preferred currency
    const userCurrency = currency || currentCurrency;
    
    // Check if we have recent data and don't need to refetch
    if (!forceRefresh && allProductsRef.current.length > 0 && lastFetch && 
        (Date.now() - lastFetch < CACHE_DURATION)) {
      console.log('🔍 ProductContext: Using cached data', allProductsRef.current.length, 'products');
      return allProductsRef.current;
    }

    try {
      console.log('🔍 ProductContext: Starting API fetch');
      setLoading(true);
      setError(null);
      
      // Add currency parameter to API call
      const url = new URL(SummaryApi.allProduct.url);
      if (userCurrency) {
        url.searchParams.append('currency', userCurrency);
      }
      
      console.log('🔍 ProductContext: Fetching from URL:', url.toString());
      const response = await fetch(url.toString(), {
        method: SummaryApi.allProduct.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 ProductContext: API response status:', response.status);
      const dataResponse = await response.json();
      console.log('🔍 ProductContext: API response data:', { success: dataResponse.success, count: dataResponse.data?.length });

      if (dataResponse.success) {
        console.log('🔍 ProductContext: Success! Setting', dataResponse.data.length, 'products');
        setAllProducts(dataResponse.data);
        allProductsRef.current = dataResponse.data;
        setLastFetch(Date.now());
        if (dataResponse.currency) {
          setCurrentCurrency(dataResponse.currency);
        }
        return dataResponse.data;
      } else {
        console.log('🔍 ProductContext: API returned error:', dataResponse.message);
        setError(dataResponse.message || 'Failed to fetch products');
        return [];
      }
    } catch (error) {
      console.error('🔍 ProductContext: Fetch error:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [lastFetch, CACHE_DURATION, currentCurrency]); // Removed allProducts to prevent infinite loop

  const getProductsByCategory = useCallback((category) => {
    console.log('🔍 ProductContext: getProductsByCategory called', { category, totalProducts: allProductsRef.current.length });
    
    if (!category || category === 'all') {
      console.log('🔍 ProductContext: Returning all products:', allProductsRef.current.length);
      return allProductsRef.current;
    }
    
    const filtered = allProductsRef.current.filter(product => 
      product.category?.toLowerCase() === category?.toLowerCase()
    );
    console.log('🔍 ProductContext: Filtered products for category', category, ':', filtered.length);
    return filtered;
  }, []); // No dependencies needed since we use ref

  const getProductById = useCallback((id) => {
    return allProductsRef.current.find(product => product._id === id);
  }, []); // No dependencies needed since we use ref

  // Auto-fetch on mount and when currency changes
  useEffect(() => {
    console.log('🔍 ProductContext: useEffect triggered', { 
      currentProducts: allProductsRef.current.length,
      timestamp: new Date().toISOString(),
      fetchAllProductsRef: !!fetchAllProducts
    });
    if (allProductsRef.current.length === 0) {
      console.log('🔍 ProductContext: No products found, calling fetchAllProducts...');
      fetchAllProducts().then((products) => {
        console.log('🔍 ProductContext: fetchAllProducts completed with', products?.length || 0, 'products');
      }).catch((error) => {
        console.error('🔍 ProductContext: fetchAllProducts failed:', error);
      });
    } else {
      console.log('🔍 ProductContext: Already have', allProductsRef.current.length, 'products, skipping fetch');
    }
  }, [fetchAllProducts]);

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
