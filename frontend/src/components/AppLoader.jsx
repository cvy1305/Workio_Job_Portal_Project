import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const AppLoader = () => {
  const { appReady } = useContext(AppContext);

  if (appReady) {
    return null; // Don't render anything when app is ready
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading jobs...</p>
      </div>
    </div>
  );
};

export default AppLoader;
