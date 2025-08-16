// Utility functions for debugging cart localStorage
export const debugCart = () => {
    console.log('=== CART DEBUG INFO ===');
    const cartData = localStorage.getItem('cart');
    console.log('Raw localStorage cart data:', cartData);
    
    if (cartData) {
        try {
            const parsed = JSON.parse(cartData);
            console.log('Parsed cart data:', parsed);
            console.log('Is array:', Array.isArray(parsed));
            console.log('Length:', parsed?.length);
            if (Array.isArray(parsed)) {
                parsed.forEach((item, index) => {
                    console.log(`Item ${index}:`, item.productName, 'Qty:', item.quantity);
                });
            }
        } catch (error) {
            console.error('Error parsing cart data:', error);
        }
    } else {
        console.log('No cart data found in localStorage');
    }
    console.log('========================');
};

export const clearCartStorage = () => {
    localStorage.removeItem('cart');
    console.log('Cart storage cleared');
};

export const setTestCart = () => {
    const testCart = [
        {
            _id: 'test1',
            productName: 'Test Product',
            brandName: 'Test Brand',
            price: 100,
            sellingPrice: 90,
            quantity: 1,
            productImage: []
        }
    ];
    localStorage.setItem('cart', JSON.stringify(testCart));
    console.log('Test cart set in localStorage');
};
