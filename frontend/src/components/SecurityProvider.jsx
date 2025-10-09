import React, { useEffect, createContext, useContext } from 'react';
import { enforceHTTPS } from '../utils/security';

const SecurityContext = createContext({});

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

const SecurityProvider = ({ children }) => {
  useEffect(() => {
    // Enforce HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      enforceHTTPS();
    }

    // Set security headers via meta tags (where possible)
    const setSecurityMeta = () => {
      // Content Security Policy
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://www.google-analytics.com; frame-src 'self' https://js.stripe.com; object-src 'none'; upgrade-insecure-requests";
      
      // X-Content-Type-Options
      const noSniffMeta = document.createElement('meta');
      noSniffMeta.httpEquiv = 'X-Content-Type-Options';
      noSniffMeta.content = 'nosniff';
      
      // Referrer Policy
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      
      // Check if meta tags already exist to avoid duplicates
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        document.head.appendChild(cspMeta);
      }
      if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
        document.head.appendChild(noSniffMeta);
      }
      if (!document.querySelector('meta[name="referrer"]')) {
        document.head.appendChild(referrerMeta);
      }
    };

    setSecurityMeta();

    // Session timeout warning
    let sessionTimeout;
    let warningTimeout;
    
    const resetSessionTimeout = () => {
      clearTimeout(sessionTimeout);
      clearTimeout(warningTimeout);
      
      // Warning at 25 minutes
      warningTimeout = setTimeout(() => {
        if (window.confirm('Your session will expire in 5 minutes. Would you like to continue?')) {
          resetSessionTimeout();
        }
      }, 25 * 60 * 1000);
      
      // Auto logout at 30 minutes
      sessionTimeout = setTimeout(() => {
        // Check if user is still on the page and active before forcing logout
        if (document.hasFocus() || document.visibilityState === 'visible') {
          const shouldLogout = window.confirm('Your session has expired for security reasons. Would you like to continue your session or log out?');
          if (shouldLogout) {
            // Use React Router navigation instead of window.location.href
            window.location.href = '/login';
          } else {
            // Reset session timeout for continued activity
            resetSessionTimeout();
          }
        } else {
          // If page is not visible, just clear tokens without redirect
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      }, 30 * 60 * 1000);
    };

    // Only set session timeout if user is logged in
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (userToken) {
      resetSessionTimeout();
      
      // Reset timeout on user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const resetHandler = () => resetSessionTimeout();
      
      events.forEach(event => {
        document.addEventListener(event, resetHandler, true);
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetHandler, true);
        });
        clearTimeout(sessionTimeout);
        clearTimeout(warningTimeout);
      };
    }
  }, []);

  // Security utility functions
  const securityUtils = {
    sanitizeInput: (input) => {
      if (typeof input !== 'string') return input;
      return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    },
    
    validateEmail: (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email) && email.length <= 254;
    },
    
    generateSecureHeaders: () => ({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }),
    
    isSecureConnection: () => {
      return window.location.protocol === 'https:' || 
             window.location.hostname === 'localhost' ||
             window.location.hostname === '127.0.0.1';
    }
  };

  return (
    <SecurityContext.Provider value={securityUtils}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider;