// Example: Enhanced Cart API call with authentication error handling
// This shows how to integrate the new authentication system with existing code

import { handleApiError } from '../utils/apiErrorHandler';
import { useNavigate, useLocation } from 'react-router-dom';

// Example of how to update the addToCart function in CartContext
const addToCartWithAuthHandling = async (product, quantity = 1, navigate, location) => {
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
            
            // Handle authentication errors with new system
            if (response.status === 401) {
                const handled = handleApiError(response, result, navigate, location);
                if (handled) {
                    // Authentication error was handled, don't fall back to local cart
                    return;
                }
            }
            
            if (result.success) {
                const transformedItems = transformServerCartItems(result.data.items || []);
                dispatch({ 
                    type: CART_ACTIONS.SYNC_WITH_SERVER, 
                    payload: transformedItems
                });
                toast.success(`${product.productName} added to cart!`);
            } else {
                toast.error(result.message || 'Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to server cart:', error);
            // Only fall back to local cart for network errors, not auth errors
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
};

// Example of how components would use the enhanced cart function
const ProductComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    
    const handleAddToCart = (product) => {
        // Pass navigation context to enable auto-redirect
        addToCart(product, 1, navigate, location);
    };
    
    return (
        <button onClick={() => handleAddToCart(product)}>
            Add to Cart
        </button>
    );
};
