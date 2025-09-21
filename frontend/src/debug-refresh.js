// Debug script to catch page refreshes
console.log('🔍 Debug script loaded');

// Track all page reloads
const originalReload = window.location.reload;
window.location.reload = function(...args) {
    console.error('🚨 PAGE RELOAD DETECTED!');
    console.trace('Reload called from:');
    return originalReload.apply(this, args);
};

// Track all navigation changes
const originalAssign = window.location.assign;
window.location.assign = function(url) {
    console.error('🚨 NAVIGATION ASSIGN DETECTED!', url);
    console.trace('Assign called from:');
    return originalAssign.call(this, url);
};

// Track href changes
let currentHref = window.location.href;
Object.defineProperty(window.location, 'href', {
    get: function() {
        return currentHref;
    },
    set: function(url) {
        console.error('🚨 LOCATION.HREF CHANGE DETECTED!', url);
        console.trace('Href change called from:');
        currentHref = url;
        window.location.assign(url);
    }
});

// Track any unhandled errors that might cause refreshes
window.addEventListener('error', function(event) {
    console.error('🚨 UNHANDLED ERROR:', event.error);
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

// Track Promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
});

console.log('🔍 Debug monitoring active');
