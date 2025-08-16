import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  
  // Only log actual errors, not normal routing
  if (error && error.status !== 404) {
    console.error(error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.statusText || error?.message || 
             "The page you're looking for doesn't exist or has been moved."}
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Go Back
          </button>
        </div>
        
        {/* Quick Navigation Links */}
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500 mb-3">Popular pages:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/help-center" className="text-blue-600 hover:text-blue-800 underline">
              Help Center
            </Link>
            <Link to="/contact-us" className="text-blue-600 hover:text-blue-800 underline">
              Contact Us
            </Link>
            <Link to="/track-order" className="text-blue-600 hover:text-blue-800 underline">
              Track Order
            </Link>
            <Link to="/returns-refunds" className="text-blue-600 hover:text-blue-800 underline">
              Returns
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>If you believe this is an error, please <Link to="/contact-us" className="text-blue-600 hover:text-blue-800 underline">contact support</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
