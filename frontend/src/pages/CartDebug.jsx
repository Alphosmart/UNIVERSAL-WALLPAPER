import React from 'react';
import { useCart } from '../context/CartContext';

const CartDebug = () => {
    const { cartItems, debugCart, addToCart, clearCart, isInitialized } = useCart();

    const handleAddTestItem = () => {
        const testProduct = {
            _id: 'test-' + Date.now(),
            productName: 'Test Product',
            brandName: 'Test Brand',
            price: 100,
            sellingPrice: 90,
            productImage: ['https://via.placeholder.com/150'],
            category: 'test'
        };
        addToCart(testProduct, 1);
    };

    const handleCheckLocalStorage = () => {
        const cartData = localStorage.getItem('mern_marketplace_cart');
        console.log('Raw localStorage data:', cartData);
        alert('Check console for localStorage data');
    };

    const handleClearLocalStorage = () => {
        localStorage.removeItem('mern_marketplace_cart');
        localStorage.removeItem('cart'); // Also clear old key if exists
        alert('localStorage cleared - refresh page to see effect');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Cart Debug Panel</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cart Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Cart Status</h2>
                        <div className="space-y-2">
                            <p><strong>Is Initialized:</strong> {isInitialized ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>Items Count:</strong> {cartItems.length}</p>
                            <p><strong>Total Items:</strong> {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                        </div>
                    </div>

                    {/* Debug Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Debug Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={debugCart}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Debug Cart (Check Console)
                            </button>
                            <button
                                onClick={handleCheckLocalStorage}
                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            >
                                Check localStorage
                            </button>
                            <button
                                onClick={handleAddTestItem}
                                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            >
                                Add Test Item
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={handleClearLocalStorage}
                                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                            >
                                Clear localStorage
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Current Cart Items</h2>
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">No items in cart</p>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={item._id} className="border p-3 rounded">
                                    <p><strong>#{index + 1}</strong></p>
                                    <p><strong>ID:</strong> {item._id}</p>
                                    <p><strong>Name:</strong> {item.productName}</p>
                                    <p><strong>Brand:</strong> {item.brandName}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> ${item.sellingPrice || item.price}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">How to Test</h2>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Add a test item to the cart</li>
                        <li>Check localStorage to see if data is saved</li>
                        <li>Logout and login again</li>
                        <li>Come back to this page to see if cart persisted</li>
                        <li>Check browser console for debug messages</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default CartDebug;
