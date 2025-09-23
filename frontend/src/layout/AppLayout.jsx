import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Hide footer only on dashboard pages, not on recruiter login/signup
  const hideFooter = location.pathname.startsWith('/dashboard');
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 w-[90%] m-auto overflow-hidden pb-4">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
