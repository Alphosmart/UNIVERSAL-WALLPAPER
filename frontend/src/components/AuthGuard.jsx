import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// ProtectedRoute: Only allows authenticated users
export const ProtectedRoute = ({ children }) => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation();
  
  if (!user?._id) {
    // Redirect to login with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// GuestRoute: Only allows non-authenticated users (for login/signup pages)
export const GuestRoute = ({ children }) => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation();
  
  if (user?._id) {
    // If user is logged in and trying to access login/signup, redirect to home
    // Or to the page they were trying to access before login
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  return children;
};

// AdminRoute: Only allows admin users
export const AdminRoute = ({ children }) => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation();
  
  if (!user?._id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
