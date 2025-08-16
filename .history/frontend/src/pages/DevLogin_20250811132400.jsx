import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DevLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleDevLogin = async () => {
        setLoading(true);
        
        // Create a development token
        const devToken = btoa(JSON.stringify({
            userId: 'dev_admin_user',
            role: 'ADMIN',
            email: 'admin@ashamsmart.com',
            name: 'Dev Admin',
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        // Set the token in localStorage for the frontend
        localStorage.setItem('token', devToken);
        
        // Also set a cookie for backend requests
        document.cookie = `token=${devToken}; path=/; max-age=86400`;
        
        toast.success('Development login successful!');
        setLoading(false);
        navigate('/admin-panel');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Development Mode
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Database is temporarily unavailable
                    </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Database Connection Issue
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    The MongoDB Atlas database is currently unavailable due to IP whitelisting. 
                                    You can use development mode to test the Site Content Management system.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleDevLogin}
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Continue with Development Mode'}
                    </button>
                    
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 hover:text-blue-500 text-sm"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">What you can test:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Site Content Management (edit page content)</li>
                        <li>• Dynamic content loading on Contact Us page</li>
                        <li>• Dynamic content loading on 404 Error page</li>
                        <li>• Admin panel navigation and interface</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DevLogin;
