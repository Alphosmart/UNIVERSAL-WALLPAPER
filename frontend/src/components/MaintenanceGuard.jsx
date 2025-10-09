import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useMaintenanceMode from '../hooks/useMaintenanceMode';
import MaintenancePage from './MaintenancePage';
import Loading from './Loading';

const MaintenanceGuard = ({ children }) => {
    const user = useSelector(state => state?.user?.user);
    const { isMaintenanceMode, isLoading, error } = useMaintenanceMode();

    // Memoize the admin check to prevent unnecessary re-renders
    const isAdmin = useMemo(() => user?.role === 'ADMIN', [user?.role]);

    // While checking maintenance status, show loading
    if (isLoading) {
        return <Loading message="Checking system status..." />;
    }

    // If there's an error checking maintenance status, allow access
    // (fail open for better user experience)
    if (error) {
        console.warn('Maintenance check error:', error);
        return children;
    }

    // If maintenance mode is disabled, allow normal access
    if (!isMaintenanceMode) {
        return children;
    }

    // If maintenance mode is enabled, check if user is admin
    if (isAdmin) {
        // Admin users can access during maintenance
        return (
            <div>
                {/* Admin maintenance notice */}
                <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">
                                <strong>Maintenance Mode Active:</strong> The site is currently under maintenance. 
                                Regular users cannot access the application.
                            </p>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        );
    }

    // Non-admin users see maintenance page
    return <MaintenancePage />;
};

export default MaintenanceGuard;
