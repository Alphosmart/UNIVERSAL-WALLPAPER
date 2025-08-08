import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SellerProtectedRoute = ({ children, requireVerified = true }) => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Please login to access seller features");
            navigate('/login');
            return;
        }

        if (requireVerified && user.sellerStatus !== 'verified') {
            let message = "";
            let redirectPath = "";

            switch (user.sellerStatus) {
                case 'none':
                    message = "You need to register as a seller to access this feature.";
                    redirectPath = '/become-seller';
                    break;
                case 'pending_verification':
                    message = "Your seller application is pending approval. You cannot access seller features until approved.";
                    redirectPath = '/seller-dashboard';
                    break;
                case 'rejected':
                    message = "Your seller application was rejected. Please contact support or reapply.";
                    redirectPath = '/become-seller';
                    break;
                default:
                    message = "You are not authorized to access seller features.";
                    redirectPath = '/become-seller';
            }

            toast.error(message);
            
            setTimeout(() => {
                navigate(redirectPath);
            }, 2000);
            
            return;
        }
    }, [user, navigate, requireVerified]);

    // Don't render children if user is not verified seller (when verification required)
    if (requireVerified && (!user || user.sellerStatus !== 'verified')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Seller Verification Required
                    </h3>
                    <p className="text-gray-600 mb-4">
                        You need to be a verified seller to access this feature.
                    </p>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/become-seller')}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                            Register as Seller
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
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
