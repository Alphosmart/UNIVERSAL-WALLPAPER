import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SellerProtectedRoute = ({ children, requireVerified = true }) => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Please login to access product management features");
            navigate('/login');
            return;
        }

        // Allow verified sellers, staff with upload permissions, or admins
        const hasAccess = user.sellerStatus === 'verified' || 
                         (user.role === 'STAFF' && user.permissions?.canUploadProducts) ||
                         user.role === 'ADMIN';

        if (requireVerified && !hasAccess) {
            let message = "";
            let redirectPath = "";

            if (user.role === 'STAFF') {
                message = "You don't have permission to upload products. Please contact an administrator.";
                redirectPath = '/';
            } else {
                switch (user.sellerStatus) {
                    case 'not_seller':
                    case null:
                    case undefined:
                        message = "Seller registration is not available. This application uses a single company model.";
                        redirectPath = '/';
                        break;
                    case 'pending_verification':
                        message = "Your seller application is pending approval. You cannot access seller features until approved.";
                        redirectPath = '/seller-dashboard';
                        break;
                    case 'rejected':
                        message = "Your seller application was rejected. Please contact support.";
                        redirectPath = '/';
                        break;
                    default:
                        message = "You are not authorized to access product management features.";
                        redirectPath = '/';
                }
            }

            toast.error(message);
            
            setTimeout(() => {
                navigate(redirectPath);
            }, 2000);
            
            return;
        }
    }, [user, navigate, requireVerified]);

    // Don't render children if user doesn't have access (when verification required)
    const hasAccess = user?.sellerStatus === 'verified' || 
                     (user?.role === 'STAFF' && user?.permissions?.canUploadProducts) ||
                     user?.role === 'ADMIN';

    if (requireVerified && (!user || !hasAccess)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Access Restricted
                    </h3>
                    <p className="text-gray-600 mb-4">
                        This application uses a single company seller model. Only authorized sellers can access this feature.
                    </p>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default SellerProtectedRoute;
