import React from 'react';
import { useSelector } from 'react-redux';

const CartDebug = () => {
  const cartItems = useSelector(state => state?.cart?.items || []);
  const cartCount = useSelector(state => state?.cart?.count || 0);

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Debug Mode Not Available</h1>
        <p>Cart debug information is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        <div className="text-sm">
          <div>Total Items: {cartCount}</div>
          <div>Cart Array Length: {cartItems.length}</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Cart Items Details</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart</p>
        ) : (
          <div className="space-y-2">
            {cartItems.map((item, index) => (
              <div key={index} className="border-b pb-2">
                <div className="text-sm">
                  <div><strong>Product ID:</strong> {item?.productId || 'N/A'}</div>
                  <div><strong>Name:</strong> {item?.productName || 'N/A'}</div>
                  <div><strong>Quantity:</strong> {item?.quantity || 0}</div>
                  <div><strong>Price:</strong> ${item?.price || 0}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="text-sm font-medium text-yellow-800">Redux State</h3>
        <pre className="text-xs text-yellow-700 mt-2 overflow-auto">
          {JSON.stringify({ cartItems, cartCount }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CartDebug;
