import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LoaderCircle } from 'lucide-react';

const RecruiterRedirect = ({ children }) => {
  const { isLogin, userData, authLoading } = useContext(AppContext);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // If user is logged in as recruiter, redirect to dashboard
  if (isLogin && userData && userData.userType === 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RecruiterRedirect;
