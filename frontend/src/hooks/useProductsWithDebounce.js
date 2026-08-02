import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';

// Custom hook for debounced product loading
const useProductsWithDebounce = (category, delay = 300) => {
  const { getProductsByCategory, loading: globalLoading, allProducts } = useProducts();
  const [debouncedCategory, setDebouncedCategory] = useState(category);

  // Debounce category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategory(category);
    }, delay);

    return () => clearTimeout(timer);
  }, [category, delay]);

  // Memoize filtered products
  const products = useMemo(() => {
    if (globalLoading || allProducts.length === 0) {
      return [];
    }
    return getProductsByCategory(debouncedCategory);
  }, [getProductsByCategory, debouncedCategory, globalLoading, allProducts.length]);

  return {
    products,
    loading: globalLoading || allProducts.length === 0,
    category: debouncedCategory
  };
};

export default useProductsWithDebounce;