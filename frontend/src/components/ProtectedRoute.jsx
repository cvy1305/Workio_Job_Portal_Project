import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = ({ children, userType = 'candidate' }) => {
  const { isLogin, userData, authLoading } = useContext(AppContext);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Check if user is authenticated and has the correct userType
  const isAuthenticated = () => {
    if (!isLogin || !userData) {
      return false;
    }
    
    if (userType === 'candidate') {
      return userData.userType === 'candidate';
    } else if (userType === 'recruiter') {
      return userData.userType === 'recruiter';
    }
    
    return false;
  };

  if (!isAuthenticated()) {
    // Redirect to home page for unauthenticated users
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
