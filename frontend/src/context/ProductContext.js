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
  const user = useSelector(state => state?.user?.user);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const allProductsRef = useRef([]);
  const lastFetchRef = useRef(null);
  const hasFetchedProductsRef = useRef(false);
  const didLogInitializeRef = useRef(false);
  const [currentCurrency, setCurrentCurrency] = useState('NGN');
  const debugLog = (...args) => { if (process.env.NODE_ENV !== 'production') console.log(...args); };

  if (!didLogInitializeRef.current) {
    debugLog('🔍 ProductProvider: Initializing at', new Date().toISOString());
    debugLog('🔍 ProductProvider: Initial state set. User:', user?.name || 'Not logged in');
    didLogInitializeRef.current = true;
  }

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
        debugLog('Could not load user currency preferences:', error);
        // Fallback to localStorage or default
        const savedCurrency = localStorage.getItem('userCurrency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    };
    
    loadUserCurrency();
  }, [user]);

  const fetchAllProducts = useCallback(async (forceRefresh = false, currency = null, useLite = true) => {
    debugLog('🔍 ProductContext: fetchAllProducts called', { forceRefresh, currency, useLite, currentProducts: allProductsRef.current.length });
    
    // Get user's preferred currency
    const userCurrency = currency || currentCurrency;
    
    // Check if we have recent data and don't need to refetch
    if (!forceRefresh && allProductsRef.current.length > 0 && lastFetchRef.current && 
        (Date.now() - lastFetchRef.current < CACHE_DURATION)) {
      debugLog('🔍 ProductContext: Using cached data', allProductsRef.current.length, 'products');
      return allProductsRef.current;
    }

    try {
      debugLog('🔍 ProductContext: Starting API fetch');
      setLoading(true);
      setError(null);
      
      // Use lite endpoint for faster loading by default
      const apiEndpoint = useLite ? SummaryApi.allProductsLite : SummaryApi.allProduct;
      const url = new URL(apiEndpoint.url);
      
      // Add parameters
      if (userCurrency) {
        url.searchParams.append('currency', userCurrency);
      }
      if (useLite) {
        url.searchParams.append('limit', '50'); // Load first 50 products quickly
        url.searchParams.append('page', '1');
      }
      
      debugLog('🔍 ProductContext: Fetching from URL:', url.toString());
      const response = await fetch(url.toString(), {
        method: apiEndpoint.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      debugLog('🔍 ProductContext: API response status:', response.status);
      const dataResponse = await response.json();
      debugLog('🔍 ProductContext: API response data:', { success: dataResponse.success, count: dataResponse.data?.length });

      if (dataResponse.success) {
        debugLog('🔍 ProductContext: Success! Setting', dataResponse.data.length, 'products');
        setAllProducts(dataResponse.data);
        allProductsRef.current = dataResponse.data;
        lastFetchRef.current = Date.now();
        hasFetchedProductsRef.current = true;
        if (dataResponse.currency) {
          setCurrentCurrency(dataResponse.currency);
        }
        return dataResponse.data;
      } else {
        debugLog('🔍 ProductContext: API returned error:', dataResponse.message);
        setError(dataResponse.message || 'Failed to fetch products');
        return [];
      }
    } catch (error) {
      console.error('🔍 ProductContext: Fetch error:', error);
      setError(error.message);
      hasFetchedProductsRef.current = true;
      return [];
    } finally {
      setLoading(false);
      hasFetchedProductsRef.current = true;
    }
  }, [CACHE_DURATION, currentCurrency]);

  const getProductsByCategory = useCallback((category) => {
    debugLog('🔍 ProductContext: getProductsByCategory called', { category, totalProducts: allProductsRef.current.length });
    
    if (!category || category === 'all') {
      debugLog('🔍 ProductContext: Returning all products:', allProductsRef.current.length);
      return allProductsRef.current;
    }
    
    const filtered = allProductsRef.current.filter(product => 
      product.category?.toLowerCase() === category?.toLowerCase()
    );
    debugLog('🔍 ProductContext: Filtered products for category', category, ':', filtered.length);
    return filtered;
  }, []); // No dependencies needed since we use ref

  const getProductById = useCallback((id) => {
    return allProductsRef.current.find(product => product._id === id);
  }, []); // No dependencies needed since we use ref

  // Auto-fetch on mount and when currency changes
  useEffect(() => {
    debugLog('🔍 ProductContext: useEffect triggered', { 
      currentProducts: allProductsRef.current.length,
      hasFetchedProducts: hasFetchedProductsRef.current,
      timestamp: new Date().toISOString(),
      fetchAllProductsRef: !!fetchAllProducts
    });

    if (allProductsRef.current.length === 0 && !hasFetchedProductsRef.current) {
      debugLog('🔍 ProductContext: No products found and fetch not attempted yet, calling fetchAllProducts...');
      fetchAllProducts().then((products) => {
        debugLog('🔍 ProductContext: fetchAllProducts completed with', products?.length || 0, 'products');
      }).catch((error) => {
        console.error('🔍 ProductContext: fetchAllProducts failed:', error);
      });
    } else if (allProductsRef.current.length === 0 && hasFetchedProductsRef.current) {
      debugLog('🔍 ProductContext: Products are empty but initial fetch already completed, skipping auto-fetch');
    } else {
      debugLog('🔍 ProductContext: Already have', allProductsRef.current.length, 'products, skipping fetch');
    }
  }, [fetchAllProducts]);

  const loadMoreProducts = useCallback(async (page = 2) => {
    try {
      setLoading(true);
      
      const url = new URL(SummaryApi.allProductsLite.url);
      url.searchParams.append('currency', currentCurrency);
      url.searchParams.append('limit', '20');
      url.searchParams.append('page', page.toString());
      
      const response = await fetch(url.toString(), {
        method: SummaryApi.allProductsLite.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const dataResponse = await response.json();
      
      if (dataResponse.success && dataResponse.data.length > 0) {
        // Append new products to existing ones
        const updatedProducts = [...allProductsRef.current, ...dataResponse.data];
        setAllProducts(updatedProducts);
        allProductsRef.current = updatedProducts;
        debugLog('🔍 ProductContext: Loaded', dataResponse.data.length, 'more products. Total:', updatedProducts.length);
        return dataResponse.pagination;
      }
      return null;
    } catch (error) {
      console.error('🔍 ProductContext: Error loading more products:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentCurrency]);

  const changeCurrency = useCallback((newCurrency) => {
    debugLog('🔍 ProductContext: changeCurrency called', newCurrency);
    setCurrentCurrency(newCurrency);
    // Force refresh with new currency
    fetchAllProducts(true, newCurrency);
  }, [fetchAllProducts]);

  const value = {
    allProducts,
    loading,
    error,
    currentCurrency,
    fetchAllProducts,
    getProductsByCategory,
    getProductById,
    changeCurrency,
    loadMoreProducts,
    refreshProducts: () => fetchAllProducts(true)
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
