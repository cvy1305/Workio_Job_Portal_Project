import {
  Briefcase,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import SignupPopup from "./SignupPopup";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { isLogin, userData, userDataLoading, fetchUserData, setIsLogin, logoutUser } =
    useContext(AppContext);
  const location = useLocation();

  const navigate = useNavigate();

  // Different menu items based on user type
  const getMenuItems = () => {
    if (userData?.userType === 'recruiter') {
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Add Job", path: "/dashboard/add-job" },
        { name: "Manage Jobs", path: "/dashboard/manage-jobs" },
        { name: "Applications", path: "/dashboard/view-applications" },
      ];
    } else {
      return [
        { name: "Home", path: "/" },
        { name: "All Jobs", path: "/all-jobs/all" },
        { name: "About", path: "/about" },
      ];
    }
  };

  const menu = getMenuItems();

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="border-b border-gray-200 mb-10">
      <nav>
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img className="w-[120px]" src={assets.workio_logo} alt="Workio Logo" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-4">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          {userDataLoading ? (
            <LoaderCircle className="animate-spin text-gray-600 hidden lg:block" />
          ) : isLogin ? (
            <div
              className="hidden lg:flex items-center gap-4 relative"
              ref={profileMenuRef}
            >
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 focus:outline-none"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="text-sm font-medium text-gray-700">
                  Hi, {userData?.name || "User"}
                </span>
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={userData?.image || assets.avatarPlaceholder}
                  alt="User profile"
                  onError={(e) => {
                    e.currentTarget.src = assets.avatarPlaceholder;
                  }}
                />
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 origin-top-right rounded-md border border-gray-200 bg-white z-50 overflow-hidden">
                  <div>
                    {userData?.userType === 'recruiter' ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                        >
                          <Briefcase size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/add-job"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                        >
                          <Upload size={16} />
                          Add Job
                        </Link>
                        <Link
                          to="/dashboard/manage-jobs"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                        >
                          <Briefcase size={16} />
                          Manage Jobs
                        </Link>
                        <Link
                          to="/dashboard/view-applications"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                        >
                          <UserRound size={16} />
                          View Applications
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/applications"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                      >
                        <Briefcase size={16} />
                        My Applications
                      </Link>
                    )}

                    <button
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setIsSignupPopupOpen(true)}
                className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm  hover:bg-blue-700 transition-colors font-medium"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Button - Hidden for recruiters */}
          {userData?.userType !== 'recruiter' && (
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu - Hidden for recruiters */}
      {userData?.userType !== 'recruiter' && (
        <div
          className={`lg:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          ref={mobileMenuRef}
        >
        <div className="fixed inset-0 backdrop-blur-sm" onClick={toggleMenu} />
        <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-white border-r border-r-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" onClick={toggleMenu}>
              <img className="h-8" src={assets.workio_logo} alt="Workio Logo" />
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menu.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={toggleMenu}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {userDataLoading ? (
              <LoaderCircle className="animate-spin text-gray-600 hidden lg:block" />
            ) : isLogin ? (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={userData?.image || assets.avatarPlaceholder}
                    alt="User profile"
                    onError={(e) => {
                      e.currentTarget.src = assets.avatarPlaceholder;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {userData?.userType === 'candidate' ? (
                    <li>
                      <Link
                        to="/applications"
                        onClick={toggleMenu}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Briefcase size={16} />
                        My Applications
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    setIsSignupPopupOpen(true);
                    toggleMenu();
                  }}
                  className="block w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 text-center cursor-pointer"
                >
                  Sign Up
                </button>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center cursor-pointer"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
      
      {/* Signup Popup */}
      <SignupPopup 
        isOpen={isSignupPopupOpen} 
        onClose={() => setIsSignupPopupOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
