import React from 'react';
import { useSelector } from 'react-redux';

const UserDebugInfo = () => {
  const user = useSelector(state => state?.user?.user);
  const userState = useSelector(state => state?.user);

  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-3">User Debug Information</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Full User State:</strong>
          <pre className="bg-white p-2 rounded text-xs overflow-auto">
            {JSON.stringify(userState, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>User Object:</strong>
          <pre className="bg-white p-2 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>User ID:</strong> {user?._id || 'Not set'}
          </div>
          <div>
            <strong>Name:</strong> {user?.name || 'Not set'}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || 'Not set'}
          </div>
          <div>
            <strong>Role:</strong> {user?.role || 'Not set (defaults to GENERAL)'}
          </div>
        </div>
        
        <div className="mt-4">
          <strong>Status:</strong>
          <ul className="list-disc list-inside mt-2">
            <li className={user?._id ? 'text-green-600' : 'text-red-600'}>
              {user?._id ? '✓ User is logged in' : '✗ User is not logged in'}
            </li>
            <li className={user?.role === 'ADMIN' ? 'text-green-600' : 'text-red-600'}>
              {user?.role === 'ADMIN' ? '✓ User has admin role' : '✗ User does not have admin role'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDebugInfo;
