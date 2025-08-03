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

  // Cache products for 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchAllProducts = useCallback(async (forceRefresh = false) => {
    // Check if we have recent data and don't need to refetch
    if (!forceRefresh && allProducts.length > 0 && lastFetch && 
        (Date.now() - lastFetch < CACHE_DURATION)) {
      return allProducts;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(SummaryApi.allProduct.url, {
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
  }, [allProducts.length, lastFetch]);

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

  // Auto-fetch on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const value = {
    allProducts,
    loading,
    error,
    fetchAllProducts,
    getProductsByCategory,
    getProductById,
    refreshProducts: () => fetchAllProducts(true)
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
