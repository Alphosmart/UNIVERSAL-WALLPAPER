// Analytics utility for comprehensive tracking
import { useEffect } from 'react';

// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
    });
  }
};

// E-commerce tracking events
export const trackPurchase = (transactionId, items, value, currency = 'USD') => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
    category: 'ecommerce'
  });
};

export const trackAddToCart = (itemId, itemName, category, quantity, value) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      quantity: quantity,
      price: value / quantity
    }],
    category: 'ecommerce'
  });
};

export const trackRemoveFromCart = (itemId, itemName, category, quantity, value) => {
  trackEvent('remove_from_cart', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      quantity: quantity,
      price: value / quantity
    }],
    category: 'ecommerce'
  });
};

export const trackBeginCheckout = (value, items) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: value,
    items: items,
    category: 'ecommerce'
  });
};

export const trackSearch = (searchTerm, numberOfResults) => {
  trackEvent('search', {
    search_term: searchTerm,
    number_of_results: numberOfResults,
    category: 'search'
  });
};

export const trackViewItem = (itemId, itemName, category, value) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      price: value
    }],
    category: 'ecommerce'
  });
};

// Landing page specific tracking
export const trackLandingPageInteraction = (action, section) => {
  trackEvent('landing_page_interaction', {
    action: action,
    section: section,
    category: 'landing_page',
    label: `${section}_${action}`
  });
};

export const trackNewsletterSignup = (source) => {
  trackEvent('newsletter_signup', {
    source: source,
    category: 'lead_generation',
    label: source
  });
};

export const trackShopButtonClick = (location, destination) => {
  trackEvent('shop_button_click', {
    button_location: location,
    destination: destination,
    category: 'conversion',
    label: `shop_button_${location}`
  });
};

// User engagement tracking
export const trackUserEngagement = (action, section, duration = null) => {
  trackEvent('user_engagement', {
    action: action,
    section: section,
    duration: duration,
    category: 'engagement',
    label: `${section}_${action}`
  });
};

// Social sharing tracking
export const trackSocialShare = (platform, url, title) => {
  trackEvent('share', {
    method: platform,
    content_type: 'product',
    content_id: url,
    content_title: title,
    category: 'social'
  });
};

// Error tracking
export const trackError = (errorType, errorMessage, page) => {
  trackEvent('exception', {
    description: errorMessage,
    fatal: false,
    error_type: errorType,
    page: page,
    category: 'error'
  });
};

// Custom hook for page view tracking
export const usePageTracking = () => {
  useEffect(() => {
    // Track page view when component mounts
    const url = window.location.href;
    const title = document.title;
    trackPageView(url, title);
  }, []);
};

// Performance tracking
export const trackPerformance = (metricName, value, unit = 'ms') => {
  trackEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    metric_unit: unit,
    category: 'performance'
  });
};

// Form tracking
export const trackFormSubmission = (formName, success, errorMessage = null) => {
  trackEvent('form_submission', {
    form_name: formName,
    success: success,
    error_message: errorMessage,
    category: 'form'
  });
};

// Scroll depth tracking
export const initializeScrollTracking = () => {
  if (typeof window === 'undefined') return;

  let scrollDepths = [25, 50, 75, 90, 100];
  let trackedDepths = new Set();

  const trackScrollDepth = () => {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        trackEvent('scroll_depth', {
          scroll_depth: depth,
          category: 'engagement',
          label: `scroll_${depth}%`
        });
      }
    });
  };

  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', trackScrollDepth);
  };
};

const analytics = {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackPurchase,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackSearch,
  trackViewItem,
  trackLandingPageInteraction,
  trackNewsletterSignup,
  trackShopButtonClick,
  trackUserEngagement,
  trackSocialShare,
  trackError,
  usePageTracking,
  trackPerformance,
  trackFormSubmission,
  initializeScrollTracking
};

export default analytics;