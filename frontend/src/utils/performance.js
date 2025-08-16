/**
 * Performance monitoring utilities
 */

// Performance monitoring for development
const isDevelopment = process.env.NODE_ENV === 'development';

export const measurePerformance = (name, fn) => {
    if (!isDevelopment) return fn();
    
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    console.log(`⚡ ${name} took ${(endTime - startTime).toFixed(2)}ms`);
    return result;
};

export const measureAsyncPerformance = async (name, fn) => {
    if (!isDevelopment) return await fn();
    
    const startTime = performance.now();
    const result = await fn();
    const endTime = performance.now();
    
    console.log(`⚡ ${name} took ${(endTime - startTime).toFixed(2)}ms`);
    return result;
};

// Debounce utility for performance
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Image optimization helper
export const getOptimizedImageUrl = (url, width = 300, quality = 80) => {
    // For now, return the original URL
    // In production, you could integrate with image optimization services
    return url;
};

// Bundle analyzer for development
export const logBundleInfo = () => {
    if (!isDevelopment) return;
    
    console.log('📦 Bundle Analysis:');
    console.log('- Environment:', process.env.NODE_ENV);
    console.log('- Build time:', new Date().toISOString());
};
