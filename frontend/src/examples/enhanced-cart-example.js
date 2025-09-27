// Example: Enhanced Cart API call with authentication error handling
// This shows how to integrate the new authentication system with existing code

import { handleApiError, authenticatedFetch, useAuthenticatedFetch } from '../utils/apiErrorHandler';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Example of how to update the addToCart function in CartContext
const addToCartWithAuthHandling = async (product, quantity = 1, navigate, location) => {
    console.log('➕ Adding to cart:', product.productName, 'quantity:', quantity);
    
    if (user && user._id) {
        // User logged in - add to server using authenticatedFetch
        try {
            const result = await authenticatedFetch(
                SummaryApi.addToCart.url,
                {
                    method: SummaryApi.addToCart.method,
                    body: JSON.stringify({ 
                        productId: product._id, 
                        quantity 
                    })
                },
                navigate,
                location
            );
            
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
            // For authentication errors, don't fall back to local cart
            if (error.message.includes('Authentication')) {
                return; // User will be redirected to login
            }
            
            // Only fall back to local cart for network errors
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
        <button 
            onClick={() => handleAddToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
            Add to Cart
        </button>
    );
};

// Example using the useAuthenticatedFetch hook
const ProductComponentWithHook = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const authFetch = useAuthenticatedFetch(navigate, location);
    
    const handleAddToCart = async (product) => {
        try {
            const result = await authFetch(SummaryApi.addToCart.url, {
                method: 'POST',
                body: JSON.stringify({ 
                    productId: product._id, 
                    quantity: 1 
                })
            });
            
            if (result.success) {
                toast.success(`${product.productName} added to cart!`);
                // Update cart state here
            }
        } catch (error) {
            // Error handling is automatic with authenticatedFetch
            console.error('Add to cart failed:', error);
        }
    };
    
    return (
        <button 
            onClick={() => handleAddToCart(product)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
            Quick Add to Cart
        </button>
    );
};

export { addToCartWithAuthHandling, ProductComponent, ProductComponentWithHook };
