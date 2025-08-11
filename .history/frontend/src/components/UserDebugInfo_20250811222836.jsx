import React from 'react';
import { useSelector } from 'react-redux';

const UserDebugInfo = () => {
  const user = useSelector(state => state?.user?.user);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">User Debug Info</h3>
      <div className="text-xs text-gray-600">
        <div>User ID: {user?._id || 'Not logged in'}</div>
        <div>Email: {user?.email || 'N/A'}</div>
        <div>Role: {user?.role || 'N/A'}</div>
        <div>Admin: {user?.role === 'ADMIN' ? 'Yes' : 'No'}</div>
        <div>Seller: {user?.role === 'SELLER' ? 'Yes' : 'No'}</div>
      </div>
    </div>
  );
};

export default UserDebugInfo;
