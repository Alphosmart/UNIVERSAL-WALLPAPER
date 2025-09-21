import React, { createContext, useContext, useEffect } from 'react';
import { initializeAnalytics, initializeScrollTracking } from '../utils/analytics';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  useEffect(() => {
    // Initialize Google Analytics
    initializeAnalytics();
    
    // Initialize scroll depth tracking
    const cleanupScrollTracking = initializeScrollTracking();
    
    // Cleanup on unmount
    return () => {
      if (cleanupScrollTracking) {
        cleanupScrollTracking();
      }
    };
  }, []);

  const value = {
    // Analytics is initialized and ready to use
    ready: true
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};