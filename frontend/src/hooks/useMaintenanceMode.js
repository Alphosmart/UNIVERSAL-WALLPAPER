import { useState, useEffect, useCallback, useRef } from 'react';
import SummaryApi from '../common';

const useMaintenanceMode = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const isCheckingRef = useRef(false);
    const hasLoadedRef = useRef(false);

    const checkMaintenanceMode = useCallback(async (showLoading = false) => {
        if (isCheckingRef.current) return;
        isCheckingRef.current = true;
        try {
            if (showLoading && !hasLoadedRef.current) setIsLoading(true);
            setError(null);

            // Add timeout for maintenance check
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch(SummaryApi.maintenanceStatus.url, {
                method: 'GET',
                credentials: 'include',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                
                if (data.success && data.data) {
                    setIsMaintenanceMode(data.data.maintenanceMode || false);
                } else {
                    // If API call fails, assume maintenance is off
                    setIsMaintenanceMode(false);
                }
            } else {
                // If API call fails, assume maintenance is off to prevent blocking users
                setIsMaintenanceMode(false);
                setError(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Request timeout - assuming maintenance is off');
            } else {
                setError(err.message || 'Failed to check maintenance status');
            }
            
            // On error, assume maintenance is off to prevent blocking users
            setIsMaintenanceMode(false);
        } finally {
            hasLoadedRef.current = true;
            isCheckingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkMaintenanceMode(true);
        
        // Check maintenance status every 5 minutes instead of 30 seconds to reduce API calls
        // and prevent potential refresh loops
        const interval = setInterval(() => checkMaintenanceMode(false), 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, [checkMaintenanceMode]);

    // Manual refresh function
    const refreshMaintenanceStatus = useCallback(() => {
        checkMaintenanceMode(false);
    }, [checkMaintenanceMode]);

    return {
        isMaintenanceMode,
        isLoading,
        error,
        refreshMaintenanceStatus
    };
};

export default useMaintenanceMode;
