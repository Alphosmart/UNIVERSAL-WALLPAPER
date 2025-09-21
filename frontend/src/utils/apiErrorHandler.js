import { toast } from 'react-toastify';

/**
 * Handle API response errors, particularly authentication errors
 * @param {Response} response - The fetch response object
 * @param {Object} responseData - The parsed JSON response data
 * @param {Function} navigate - React Router navigate function (optional)
 * @param {Object} location - Current location object (optional)
 * @returns {boolean} - Returns true if error was handled, false otherwise
 */
export const handleApiError = async (response, responseData, navigate = null, location = null) => {
  // Handle authentication errors
  if (response.status === 401 && responseData) {
    const { message, redirectTo, requiresAuth, expired } = responseData;
    
    // Show appropriate toast message
    if (expired) {
      toast.error(message || "Your session has expired. Please log in again.");
    } else if (requiresAuth) {
      toast.warn(message || "Please log in to access this feature.");
    } else {
      toast.error(message || "Authentication required.");
    }
    
    // Redirect to login if navigate function is provided
    if (navigate && (redirectTo || requiresAuth)) {
      // Preserve the current location so user can return after login
      const from = location?.pathname || window.location.pathname;
      const loginPath = redirectTo || '/login';
      navigate(loginPath, { 
        state: { from: { pathname: from } },
        replace: true 
      });
    }
    
    return true;
  }
  
  // Handle other common error statuses
  if (response.status === 403) {
    toast.error(responseData?.message || "You don't have permission to access this resource.");
    return true;
  }
  
  if (response.status === 404) {
    toast.error(responseData?.message || "The requested resource was not found.");
    return true;
  }
  
  if (response.status === 409) {
    toast.error(responseData?.message || "Resource conflict. Please try again.");
    return true;
  }
  
  if (response.status >= 500) {
    toast.error(responseData?.message || "Server error. Please try again later.");
    return true;
  }
  
  // Handle validation errors (400)
  if (response.status === 400 && responseData?.errors) {
    if (Array.isArray(responseData.errors)) {
      responseData.errors.forEach(error => toast.error(error));
    } else {
      toast.error(responseData.message || "Invalid request data.");
    }
    return true;
  }
  
  return false;
};

/**
 * Enhanced fetch wrapper that automatically handles authentication errors
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {Function} navigate - React Router navigate function (optional)
 * @param {Object} location - Current location object (optional)
 * @returns {Promise<Object>} - Returns the response data or throws error
 */
export const authenticatedFetch = async (url, options = {}, navigate = null, location = null) => {
  try {
    const response = await fetch(url, {
      credentials: 'include', // Always include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const responseData = await response.json();
    
    // Handle authentication errors automatically
    if (response.status === 401) {
      handleApiError(response, responseData, navigate, location);
      throw new Error(responseData.message || 'Authentication required');
    }
    
    // Handle other errors based on our backend's response format
    if (!response.ok) {
      // Our backend returns { success: false, error: true, message: "..." } for errors
      if (responseData.error === true || responseData.success === false) {
        // Handle different error types
        const errorHandled = handleApiError(response, responseData, navigate, location);
        if (!errorHandled) {
          throw new Error(responseData.message || `Request failed with status ${response.status}`);
        } else {
          throw new Error(responseData.message || 'Request failed');
        }
      }
    }
    
    // Return the successful response data
    return responseData;
    
  } catch (error) {
    // If it's already an Error object, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    
    // For network errors or other fetch failures
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Hook for creating an authenticated fetch function with navigation context
 * Use this in components that need automatic login redirects
 */
export const useAuthenticatedFetch = (navigate, location) => {
  return (url, options = {}) => authenticatedFetch(url, options, navigate, location);
};

/**
 * Test backend connectivity
 * @returns {Promise<boolean>} - Returns true if backend is reachable
 */
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/health', {
      method: 'GET',
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

/**
 * Get backend health status
 * @returns {Promise<Object|null>} - Returns health data or null if unavailable
 */
export const getBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:8080/health', {
      method: 'GET',
      credentials: 'include'
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to get backend health:', error);
    return null;
  }
};
