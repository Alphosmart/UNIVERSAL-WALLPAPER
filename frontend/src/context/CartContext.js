import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { useSelector } from 'react-redux';

/**
 * CartContext - Optimized for React StrictMode compatibility with Server Sync
 * 
 * Key improvements:
 * - Prevents duplicate initialization in React StrictMode
 * - Reduces console noise with conditional logging
 * - Uses useCallback and useMemo for performance optimization
 * - Handles localStorage gracefully with validation
 * - Syncs cart with server when user is logged in
 * - Maintains cart state across different browsers/devices
 */

const CartContext = createContext();

// Cart storage key
const CART_STORAGE_KEY = 'mern_marketplace_cart';

// Development logging utility - more restrictive for performance
const isDevelopment = process.env.NODE_ENV === 'development';
const isVerboseLogging = false; // Set to true only when debugging specific issues
const cartLog = (message, ...args) => {
    if (isDevelopment && isVerboseLogging) {
        console.log(message, ...args);
    }
};

// Cart actions
const CART_ACTIONS = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    LOAD_CART: 'LOAD_CART',
    SET_INITIALIZED: 'SET_INITIALIZED',
    SET_LOADING: 'SET_LOADING',
    SYNC_WITH_SERVER: 'SYNC_WITH_SERVER',
    SET_SYNC_STATUS: 'SET_SYNC_STATUS'
};

// Utility functions for localStorage
const saveCartToStorage = (cartItems) => {
    try {
        const cartData = JSON.stringify(cartItems);
        localStorage.setItem(CART_STORAGE_KEY, cartData);
        cartLog('✅ Cart saved to localStorage:', cartItems.length, 'items');
        return true;
    } catch (error) {
        console.error('❌ Error saving cart to localStorage:', error);
        return false;
    }
};

const loadCartFromStorage = () => {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        
        if (!savedCart || savedCart === 'undefined' || savedCart === 'null') {
            cartLog('📦 No cart data found in localStorage');
            return [];
        }

        const parsedCart = JSON.parse(savedCart);
        
        if (!Array.isArray(parsedCart)) {
            cartLog('⚠️ Invalid cart data format, expected array');
            return [];
        }

        // Validate and filter cart items
        const validItems = parsedCart.filter(item => {
            const isValid = item && 
                           item._id && 
                           item.productName && 
                           typeof item.quantity === 'number' && 
                           item.quantity > 0 &&
                           (item.price || item.sellingPrice);
            
            if (!isValid) {
                cartLog('⚠️ Invalid cart item filtered out:', item);
            }
            return isValid;
        });

        cartLog('✅ Cart loaded successfully:', validItems.length, 'valid items');
        return validItems;
    } catch (error) {
        console.error('❌ Error loading cart from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem(CART_STORAGE_KEY);
        return [];
    }
};

// Server sync utilities - optimized to avoid redundant API calls
const checkAuthStatus = (user) => {
    // Use Redux user state instead of making additional API calls
    return user && user._id;
};

// Helper function to transform server cart items to frontend format
const transformServerCartItems = (serverItems) => {
    if (!Array.isArray(serverItems)) return [];
    
    return serverItems.map(item => {
        // If item has populated productId, extract data from it
        if (item.productId && typeof item.productId === 'object') {
            return {
                _id: item.productId._id,
                productName: item.productId.productName || item.productName,
                brandName: item.productId.brandName || item.brandName,
                price: item.productId.price || item.price,
                sellingPrice: item.productId.sellingPrice || item.sellingPrice,
                productImage: item.productId.productImage || [item.productImage],
                category: item.productId.category || item.category,
                quantity: item.quantity,
            };
        }
        // If item already has _id, return as is
        return item;
    });
};

const syncCartWithServer = async (localItems = []) => {
    try {
        const response = await fetch(SummaryApi.syncCart.url, {
            method: SummaryApi.syncCart.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ localCartItems: localItems })
        });

        const result = await response.json();
        
        if (result.success) {
            cartLog('✅ Cart synced with server successfully');
            const transformedItems = transformServerCartItems(result.data.items || []);
            return transformedItems;
        } else {
            cartLog('⚠️ Server cart sync failed:', result.message);
            // If it's an auth error, fall back to local cart
            if (result.message && result.message.includes('Login')) {
                cartLog('🔓 Authentication required, using local cart');
                return localItems;
            }
            return localItems;
        }
    } catch (error) {
        console.error('❌ Error syncing cart with server:', error);
        return localItems;
    }
};

// Cart reducer
const cartReducer = (state, action) => {
    // Only log non-initialization actions to reduce console noise
    if (action.type !== CART_ACTIONS.SET_INITIALIZED) {
        cartLog('🔄 Cart action:', action.type, action.payload);
    }
    
    switch (action.type) {
        case CART_ACTIONS.LOAD_CART:
            const loadedState = {
                ...state,
                items: action.payload,
                isInitialized: true,
                isLoading: false
            };
            cartLog('📥 Cart loaded:', loadedState.items.length, 'items');
            return loadedState;

        case CART_ACTIONS.ADD_TO_CART:
            const existingItem = state.items.find(item => item._id === action.payload._id);
            let newState;
            
            if (existingItem) {
                newState = {
                    ...state,
                    items: state.items.map(item =>
                        item._id === action.payload._id
                            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                            : item
                    )
                };
                cartLog('➕ Updated quantity for existing item:', action.payload.productName);
            } else {
                newState = {
                    ...state,
                    items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
                };
                cartLog('🆕 Added new item to cart:', action.payload.productName);
            }
            
            // Save to localStorage immediately
            if (state.isInitialized) {
                saveCartToStorage(newState.items);
            }
            
            return newState;

        case CART_ACTIONS.REMOVE_FROM_CART:
            cartLog('🗑️ Removing item with ID:', action.payload);
            cartLog('📋 Current items:', state.items.map(item => ({ id: item._id, name: item.productName })));
            
            const removeState = {
                ...state,
                items: state.items.filter(item => {
                    const shouldKeep = item._id !== action.payload;
                    if (!shouldKeep) {
                        cartLog('❌ Removing item:', item.productName);
                    }
                    return shouldKeep;
                })
            };
            
            cartLog('📋 Items after removal:', removeState.items.map(item => ({ id: item._id, name: item.productName })));
            
            // Save to localStorage immediately
            if (state.isInitialized) {
                saveCartToStorage(removeState.items);
            }
            
            return removeState;

        case CART_ACTIONS.UPDATE_QUANTITY:
            cartLog('� Updating quantity:', action.payload.productId, 'new quantity:', action.payload.quantity);
            cartLog('� Current items:', state.items.map(item => ({ id: item._id, name: item.productName, quantity: item.quantity })));
            
            let updateState;
            
            if (action.payload.quantity <= 0) {
                cartLog('⚠️ Quantity <= 0, removing item');
                updateState = {
                    ...state,
                    items: state.items.filter(item => {
                        const shouldKeep = item._id !== action.payload.productId;
                        return shouldKeep;
                    })
                };
            } else {
                cartLog('� Updating quantity for existing item');
                updateState = {
                    ...state,
                    items: state.items.map(item => {
                        if (item._id === action.payload.productId) {
                            cartLog(`� Found matching item: ${item.productName}, updating quantity from ${item.quantity} to ${action.payload.quantity}`);
                            return { ...item, quantity: action.payload.quantity };
                        }
                        return item;
                    })
                };
            }
            
            cartLog('� Items after update:', updateState.items.map(item => ({ id: item._id, name: item.productName, quantity: item.quantity })));
            
            // Save to localStorage immediately
            if (state.isInitialized) {
                saveCartToStorage(updateState.items);
            }
            
            return updateState;

        case CART_ACTIONS.CLEAR_CART:
            const clearState = {
                ...state,
                items: []
            };
            
            // Save to localStorage immediately
            if (state.isInitialized) {
                saveCartToStorage(clearState.items);
            }
            
            return clearState;

        case CART_ACTIONS.SET_INITIALIZED:
            return {
                ...state,
                isInitialized: true,
                isLoading: false
            };

        case CART_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        case CART_ACTIONS.SYNC_WITH_SERVER:
            return {
                ...state,
                items: action.payload || [],
                isInitialized: true,
                isSyncing: false,
                isLoading: false
            };

        case CART_ACTIONS.SET_SYNC_STATUS:
            return {
                ...state,
                isSyncing: action.payload
            };

        default:
            return state;
    }
};

// Cart provider component with React StrictMode handling and server sync
export const CartProvider = ({ children }) => {
    const user = useSelector(state => state?.user?.user);
    
    // Initialize cart with localStorage data immediately to prevent flash of empty content
    const getInitialCartState = () => {
        const savedItems = loadCartFromStorage();
        return {
            items: savedItems,
            isInitialized: savedItems.length > 0, // Consider initialized if we have local data
            isSyncing: false,
            isLoading: savedItems.length === 0 // Only show loading if no local data
        };
    };
    
    const [cartState, dispatch] = useReducer(cartReducer, getInitialCartState());

    // Load cart from localStorage on mount and sync with server if user is logged in
    useEffect(() => {
        // Only run this effect on initialization or when user authentication changes
        if (!cartState.isInitialized) {
            cartLog('🚀 CartProvider initializing from scratch...');
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
            
            const loadCart = async () => {
                const savedItems = loadCartFromStorage();
                
                if (user && user._id) {
                    // User appears logged in - verify auth and sync with server
                    cartLog('👤 User appears logged in, verifying authentication...');
                    const isAuthenticated = checkAuthStatus(user);
                    
                    if (isAuthenticated) {
                        cartLog('✅ Authentication verified, syncing cart with server...');
                        try {
                            const serverItems = await syncCartWithServer(savedItems);
                            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: serverItems });
                            // Clear localStorage after successful sync
                            localStorage.removeItem(CART_STORAGE_KEY);
                        } catch (error) {
                            console.error('Failed to sync with server, using local cart:', error);
                            if (savedItems.length > 0) {
                                dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedItems });
                            } else {
                                dispatch({ type: CART_ACTIONS.SET_INITIALIZED });
                            }
                        }
                    } else {
                        cartLog('🔓 Authentication failed, using local cart...');
                        if (savedItems.length > 0) {
                            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedItems });
                        } else {
                            dispatch({ type: CART_ACTIONS.SET_INITIALIZED });
                        }
                    }
                } else {
                    // User not logged in - use localStorage
                    cartLog('🔓 User not logged in, using local cart...');
                    if (savedItems.length > 0) {
                        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedItems });
                    } else {
                        dispatch({ type: CART_ACTIONS.SET_INITIALIZED });
                    }
                }
            };

            loadCart();
        }
    }, [cartState.isInitialized, user]);

    // Separate effect for syncing existing cart when user logs in
    useEffect(() => {
        // Only trigger if cart is already initialized and user state changed
        if (!cartState.isInitialized) {
            return;
        }

        cartLog('👤 User state changed, re-syncing cart...');
        
        const handleUserChange = async () => {
            const savedItems = loadCartFromStorage();
            
            if (user && user._id) {
                // User just logged in - sync with server
                cartLog('👤 User logged in, syncing with server...');
                const isAuthenticated = checkAuthStatus(user);
                
                if (isAuthenticated) {
                    try {
                        const serverItems = await syncCartWithServer(savedItems);
                        dispatch({ type: CART_ACTIONS.SYNC_WITH_SERVER, payload: serverItems });
                        // Clear localStorage after successful sync
                        localStorage.removeItem(CART_STORAGE_KEY);
                    } catch (error) {
                        console.error('Failed to sync with server after login:', error);
                    }
                }
            } else {
                // User logged out - clear server-synced items and use localStorage
                cartLog('🔓 User logged out, using local cart...');
                if (savedItems.length > 0) {
                    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedItems });
                } else {
                    dispatch({ type: CART_ACTIONS.CLEAR_CART });
                }
            }
        };

        handleUserChange();
    }, [user, cartState.isInitialized]);

    // Debug: Log cart state changes (minimal for performance)
    useEffect(() => {
        // Only log significant state changes
        if (isVerboseLogging && (cartState.items.length > 0 || !cartState.isInitialized)) {
            cartLog('🛒 Cart state updated:', {
                itemCount: cartState.items.length,
                isInitialized: cartState.isInitialized
            });
        }
    }, [cartState.items.length, cartState.isInitialized]);

    // Cart actions with server sync support
    const addToCart = useCallback(async (product, quantity = 1) => {
        cartLog('➕ Adding to cart:', product.productName, 'quantity:', quantity);
        
        if (user && user._id) {
            // User logged in - add to server
            try {
                const response = await fetch(SummaryApi.addToCart.url, {
                    method: SummaryApi.addToCart.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        productId: product._id, 
                        quantity 
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    const transformedItems = transformServerCartItems(result.data.items || []);
                    dispatch({ 
                        type: CART_ACTIONS.SYNC_WITH_SERVER, 
                        payload: transformedItems
                    });
                    toast.success(`${product.productName} added to cart!`);
                } else {
                    cartLog('⚠️ Server add to cart failed:', result.message);
                    // If auth failed, fall back to local cart
                    if (result.message && result.message.includes('Login')) {
                        cartLog('🔓 Authentication required, adding to local cart');
                        dispatch({ 
                            type: CART_ACTIONS.ADD_TO_CART, 
                            payload: { ...product, quantity } 
                        });
                        toast.success(`${product.productName} added to cart!`);
                    } else {
                        toast.error(result.message || 'Failed to add item to cart');
                    }
                }
            } catch (error) {
                console.error('Error adding to server cart:', error);
                cartLog('🔓 Falling back to local cart due to server error');
                // Fall back to local cart on error
                dispatch({ 
                    type: CART_ACTIONS.ADD_TO_CART, 
                    payload: { ...product, quantity } 
                });
                toast.success(`${product.productName} added to cart!`);
            }
        } else {
            // User not logged in - add to local cart
            dispatch({ 
                type: CART_ACTIONS.ADD_TO_CART, 
                payload: { ...product, quantity } 
            });
            toast.success(`${product.productName} added to cart!`);
        }
    }, [user]);

    const removeFromCart = useCallback(async (productId) => {
        cartLog('➖ Removing from cart:', productId);
        
        if (user && user._id) {
            // User logged in - try to remove from server first
            try {
                const response = await fetch(`${SummaryApi.removeFromCart.url}/${productId}`, {
                    method: SummaryApi.removeFromCart.method,
                    credentials: 'include'
                });

                const result = await response.json();
                
                if (result.success) {
                    const transformedItems = transformServerCartItems(result.data.items || []);
                    dispatch({ 
                        type: CART_ACTIONS.SYNC_WITH_SERVER, 
                        payload: transformedItems
                    });
                    toast.success('Item removed from cart');
                } else {
                    cartLog('⚠️ Server remove failed:', result.message);
                    // If auth failed or server error, fall back to local cart
                    if (result.message && result.message.includes('Login')) {
                        cartLog('🔓 Authentication required, removing from local cart');
                    } else {
                        cartLog('🔄 Server error, removing from local cart');
                    }
                    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
                    toast.success('Item removed from cart');
                }
            } catch (error) {
                console.error('Error removing from server cart:', error);
                cartLog('🔓 Falling back to local cart due to server error');
                // Fall back to local cart on error
                dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
                toast.success('Item removed from cart');
            }
        } else {
            // User not logged in - remove from local cart
            cartLog('🔓 Removing from local cart');
            dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: productId });
            toast.success('Item removed from cart');
        }
    }, [user]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        cartLog('🔄 Updating quantity:', productId, 'new quantity:', quantity);
        
        if (user && user._id) {
            // User logged in - try to update on server first
            try {
                cartLog('� Sending server request...');
                const response = await fetch(SummaryApi.updateCartItem.url, {
                    method: SummaryApi.updateCartItem.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        productId, 
                        quantity 
                    })
                });

                const result = await response.json();
                cartLog('� Server response:', result);
                
                if (result.success) {
                    cartLog('✅ Server update successful, syncing...');
                    const transformedItems = transformServerCartItems(result.data.items || []);
                    dispatch({ 
                        type: CART_ACTIONS.SYNC_WITH_SERVER, 
                        payload: transformedItems
                    });
                } else {
                    cartLog('⚠️ Server update failed, falling back to local cart');
                    cartLog('⚠️ Server update failed:', result.message);
                    // Fall back to local cart
                    dispatch({ 
                        type: CART_ACTIONS.UPDATE_QUANTITY, 
                        payload: { productId, quantity } 
                    });
                }
            } catch (error) {
                console.error('Error updating server cart:', error);
                cartLog('🔓 Falling back to local cart due to server error');
                // Fall back to local cart on error
                dispatch({ 
                    type: CART_ACTIONS.UPDATE_QUANTITY, 
                    payload: { productId, quantity } 
                });
            }
        } else {
            // User not logged in - update local cart
            cartLog('� User not logged in, updating local cart');
            dispatch({ 
                type: CART_ACTIONS.UPDATE_QUANTITY, 
                payload: { productId, quantity } 
            });
        }
    }, [user]);

    const clearCart = useCallback(async () => {
        cartLog('🗑️ Clearing cart');
        
        if (user && user._id) {
            // User logged in - try to clear server cart first
            try {
                const response = await fetch(SummaryApi.clearCart.url, {
                    method: SummaryApi.clearCart.method,
                    credentials: 'include'
                });

                const result = await response.json();
                
                if (result.success) {
                    const transformedItems = transformServerCartItems(result.data.items || []);
                    dispatch({ 
                        type: CART_ACTIONS.SYNC_WITH_SERVER, 
                        payload: transformedItems
                    });
                    toast.success('Cart cleared');
                } else {
                    cartLog('⚠️ Server clear failed:', result.message);
                    // Fall back to local cart
                    dispatch({ type: CART_ACTIONS.CLEAR_CART });
                    toast.success('Cart cleared');
                }
            } catch (error) {
                console.error('Error clearing server cart:', error);
                cartLog('🔓 Falling back to local cart due to server error');
                // Fall back to local cart on error
                dispatch({ type: CART_ACTIONS.CLEAR_CART });
                toast.success('Cart cleared');
            }
        } else {
            // User not logged in - clear local cart
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
            toast.success('Cart cleared');
        }
    }, [user]);

    const getCartTotal = useCallback(() => {
        return cartState.items.reduce((total, item) => {
            const price = item.sellingPrice || item.price || 0;
            return total + (price * item.quantity);
        }, 0);
    }, [cartState.items]);

    const getCartItemsCount = useCallback(() => {
        return cartState.items.reduce((total, item) => total + item.quantity, 0);
    }, [cartState.items]);

    const isInCart = useCallback((productId) => {
        return cartState.items.some(item => item._id === productId);
    }, [cartState.items]);

    const getCartItem = useCallback((productId) => {
        return cartState.items.find(item => item._id === productId);
    }, [cartState.items]);

    // Debug function to manually check localStorage
    const debugCart = useCallback(() => {
        console.log('=== CART DEBUG ===');
        console.log('Current cart state:', cartState);
        console.log('LocalStorage data:', localStorage.getItem(CART_STORAGE_KEY));
        console.log('Cart items with IDs:', cartState.items.map(item => ({
            id: item._id,
            idType: typeof item._id,
            name: item.productName,
            quantity: item.quantity
        })));
        console.log('React StrictMode is:', process.env.NODE_ENV === 'development' ? 'enabled (causing double render)' : 'disabled');
        console.log('==================');
    }, [cartState]);

    // Test remove function
    const testRemove = useCallback((productId) => {
        console.log('=== TESTING REMOVE ===');
        console.log('Product ID to remove:', productId, 'Type:', typeof productId);
        console.log('Current cart items:');
        cartState.items.forEach((item, index) => {
            console.log(`Item ${index}:`, {
                id: item._id,
                idType: typeof item._id,
                name: item.productName,
                matches: item._id === productId,
                strictMatches: item._id === productId && typeof item._id === typeof productId
            });
        });
        console.log('Filter test:', cartState.items.filter(item => item._id !== productId));
        console.log('====================');
    }, [cartState.items]);

    // Enhanced remove function for debugging
    const removeFromCartDebug = useCallback((productId) => {
        console.log('🔍 DEBUG REMOVE CALLED with ID:', productId, 'Type:', typeof productId);
        console.log('🔍 Current cart items:', cartState.items.map(item => ({ id: item._id, name: item.productName, type: typeof item._id })));
        
        // Test the filter logic
        const filteredItems = cartState.items.filter(item => {
            const shouldKeep = item._id !== productId;
            console.log(`🔍 Item ${item.productName}: ${item._id} !== ${productId} = ${shouldKeep}`);
            return shouldKeep;
        });
        
        console.log('🔍 Items after filter:', filteredItems.map(item => ({ id: item._id, name: item.productName })));
        
        // Now call the actual remove function
        removeFromCart(productId);
    }, [cartState.items, removeFromCart]);

    const value = useMemo(() => ({
        cartItems: cartState.items,
        isInitialized: cartState.isInitialized,
        isSyncing: cartState.isSyncing,
        isLoading: cartState.isLoading || false,
        isLoggedIn: !!(user && user._id),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getCartItem,
        debugCart, // Temporary debug function
        testRemove, // Temporary test function
        removeFromCartDebug // Enhanced debug function
    }), [
        cartState.items, 
        cartState.isInitialized,
        cartState.isSyncing,
        cartState.isLoading,
        user,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal, 
        getCartItemsCount, 
        isInCart, 
        getCartItem, 
        debugCart,
        testRemove,
        removeFromCartDebug
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
