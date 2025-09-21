# Authentication Redirect System Documentation

## Overview
The authentication system automatically redirects users to the login page when they try to access account-related functionality without being authenticated. This ensures a smooth user experience while maintaining security.

## How It Works

### Backend Authentication Middleware
The `authToken` middleware in `/backend/middleware/authToken.js` now provides enhanced responses:

```javascript
// When no token is provided
{
  "message": "Authentication required. Please log in to access your account.",
  "error": true,
  "success": false,
  "redirectTo": "/login",
  "requiresAuth": true
}

// When session expires
{
  "message": "Your session has expired. Please log in again to continue.",
  "error": true,
  "success": false,
  "expired": true,
  "redirectTo": "/login",
  "requiresAuth": true
}
```

### Frontend Route Protection
The frontend uses several guard components to protect routes:

1. **ProtectedRoute**: Requires authentication
2. **GuestRoute**: Only for non-authenticated users
3. **AdminRoute**: Only for admin users
4. **SellerRoute**: Only for sellers/admins

### Enhanced Error Handling
The new `apiErrorHandler.js` utility provides:

- Automatic detection of authentication errors
- User-friendly toast notifications
- Automatic redirect to login page
- Preservation of intended destination

## Usage Examples

### Basic Usage in Components

```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { handleApiError, authenticatedFetch } from '../utils/apiErrorHandler';

const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/protected-endpoint', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      // Handle authentication errors automatically
      if (response.status === 401) {
        handleApiError(response, data, navigate, location);
        return;
      }
      
      // Process successful response
      console.log(data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };
};
```

### Using the Enhanced Fetch Wrapper

```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { authenticatedFetch } from '../utils/apiErrorHandler';

const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleApiCall = async () => {
    try {
      const data = await authenticatedFetch('/api/protected-endpoint', {
        method: 'GET'
      }, navigate, location);
      
      // Handle successful response
      console.log(data);
    } catch (error) {
      // Authentication errors are automatically handled
      // Other errors can be handled here
      console.error('API call failed:', error);
    }
  };
};
```

### Using the Hook

```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthenticatedFetch } from '../utils/apiErrorHandler';

const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authFetch = useAuthenticatedFetch(navigate, location);

  const handleApiCall = async () => {
    try {
      const data = await authFetch('/api/protected-endpoint', {
        method: 'GET'
      });
      
      console.log(data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };
};
```

## Protected Routes
All routes requiring authentication are automatically protected:

### User Account Features
- `/profile` - User profile management
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/my-orders` - Order history
- `/my-products` - User's products (for sellers)

### Admin Features
- `/admin-panel/*` - All admin functionality

### Seller Features
- `/seller-account-settings` - Seller settings
- `/seller-dashboard` - Seller dashboard
- `/seller-orders` - Seller order management

## User Flow

### Unauthenticated User Trying to Access Protected Content
1. User clicks on "My Account" or tries to access `/profile`
2. Frontend ProtectedRoute detects no authentication
3. User is redirected to `/login` with return URL stored
4. After successful login, user is redirected back to `/profile`

### API Call from Unauthenticated User
1. User tries to perform an action requiring authentication
2. Frontend makes API call to protected endpoint
3. Backend `authToken` middleware detects no token
4. Backend returns 401 with `redirectTo: "/login"` and `requiresAuth: true`
5. Frontend `handleApiError` detects authentication requirement
6. User sees toast: "Authentication required. Please log in to access your account."
7. User is automatically redirected to login page
8. Current page is preserved for post-login redirect

### Session Expiration
1. User has been logged in but session expires
2. User tries to perform an action
3. Backend detects expired token
4. Backend returns 401 with `expired: true` and clears cookie
5. Frontend shows toast: "Your session has expired. Please log in again."
6. User is redirected to login page

## Best Practices

1. **Always use `credentials: 'include'`** in fetch requests to protected endpoints
2. **Wrap protected API calls** with the error handler
3. **Use the provided guard components** for route protection
4. **Handle the returned errors gracefully** in your components
5. **Test the flow** by trying to access protected features while logged out

## Testing the System

1. Log out of the application
2. Try to access `/profile` - should redirect to login
3. Try to add items to cart - should show authentication message and redirect
4. Try to access admin panel - should redirect to login
5. After login, verify you're redirected to the original intended page

## Migration Guide

To update existing components to use the new system:

1. Import the error handler utilities
2. Add navigate and location to your component
3. Wrap API calls with the error handler
4. Remove manual authentication error handling code

The system is backward compatible - existing code will continue to work, but won't get the enhanced redirect functionality until updated.
