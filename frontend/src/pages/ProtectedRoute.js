import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If children are passed, render them; otherwise render <Outlet />
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
