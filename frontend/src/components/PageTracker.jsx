import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view when location changes
    const url = `${window.location.origin}${location.pathname}${location.search}`;
    const title = document.title;
    
    // Small delay to ensure page title is updated
    setTimeout(() => {
      trackPageView(url, document.title || title);
    }, 100);
  }, [location]);

  return null; // This component doesn't render anything
};

export default PageTracker;