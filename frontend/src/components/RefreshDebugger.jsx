import { useEffect } from 'react';

const RefreshDebugger = () => {
    // Only enable in development or when explicitly debugging
    const isDebugMode = process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true');
    
    useEffect(() => {
        if (!isDebugMode) return;
        
        // Override console methods to track potential refresh triggers
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = function(...args) {
            if (args.some(arg => typeof arg === 'string' && 
                (arg.includes('refresh') || arg.includes('reload') || arg.includes('navigation')))) {
                console.trace('🚨 POTENTIAL REFRESH TRIGGER:', ...args);
            }
            return originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
            if (args.some(arg => typeof arg === 'string' && 
                (arg.includes('refresh') || arg.includes('reload') || arg.includes('navigation')))) {
                console.trace('⚠️ POTENTIAL REFRESH WARNING:', ...args);
            }
            return originalWarn.apply(console, args);
        };

        // Track window focus/blur to detect if refreshes happen during focus changes
        const handleFocus = () => console.log('🔍 Window focused at:', new Date().toISOString());
        const handleBlur = () => console.log('🔍 Window blurred at:', new Date().toISOString());
        const handleVisibilityChange = () => {
            console.log('🔍 Visibility changed:', document.visibilityState, 'at:', new Date().toISOString());
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Track any navigation attempts
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        
        window.history.pushState = function(...args) {
            console.log('🔍 Navigation pushState:', args[2]);
            return originalPushState.apply(this, args);
        };
        
        window.history.replaceState = function(...args) {
            console.log('🔍 Navigation replaceState:', args[2]);
            return originalReplaceState.apply(this, args);
        };

        // Track beforeunload events
        const handleBeforeUnload = (event) => {
            console.log('🚨 Page about to unload/refresh!');
            console.trace('Beforeunload triggered');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup
        return () => {
            console.error = originalError;
            console.warn = originalWarn;
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, [isDebugMode]);

    // Monitor for common refresh patterns
    useEffect(() => {
        if (!isDebugMode) return;
        const intervals = [];
        const timeouts = [];
        
        // Override setInterval to track intervals that might cause refreshes
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            if (delay < 60000) { // Track intervals less than 1 minute
                console.log(`🔍 setInterval created with ${delay}ms delay`);
                console.trace('Interval creation');
            }
            const id = originalSetInterval.call(this, callback, delay, ...args);
            intervals.push(id);
            return id;
        };

        // Override setTimeout to track timeouts
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(callback, delay, ...args) {
            if (delay < 30000) { // Track timeouts less than 30 seconds
                console.log(`🔍 setTimeout created with ${delay}ms delay`);
            }
            const id = originalSetTimeout.call(this, callback, delay, ...args);
            timeouts.push(id);
            return id;
        };

        return () => {
            window.setInterval = originalSetInterval;
            window.setTimeout = originalSetTimeout;
        };
    }, [isDebugMode]);

    return null; // This component doesn't render anything
};

export default RefreshDebugger;