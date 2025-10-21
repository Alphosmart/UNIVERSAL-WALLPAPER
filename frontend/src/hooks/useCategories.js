import { useState, useEffect, useCallback } from 'react';
import SummaryApi from '../common';
import productCategory from '../helper/productCategory';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        // Default fallback categories from productCategory helper
        const defaultCategories = productCategory.map(cat => cat.value);
        
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(SummaryApi.adminCategories.url, {
                method: SummaryApi.adminCategories.method,
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success && data.categories) {
                // Extract category names for form usage
                const categoryNames = data.categories
                    .sort((a, b) => a.order - b.order)
                    .map(cat => cat.name);
                setCategories(categoryNames);
            } else {
                // Fallback to default categories
                setCategories(defaultCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.message);
            // Fallback to default categories
            setCategories(defaultCategories);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const refreshCategories = () => {
        fetchCategories();
    };

    return {
        categories,
        loading,
        error,
        refreshCategories
    };
};

export default useCategories;