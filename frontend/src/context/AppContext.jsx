import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // For single service deployment, use relative API paths
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false); // Start with false since we'll preload
  const [appReady, setAppReady] = useState(false); // New state to track if app is ready

  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userApplication, setUserApplication] = useState(null);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Add auth loading state

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    setAuthLoading(true);

    try {
      // Always attempt to check user authentication
      // If httpOnly cookie exists, server will accept it automatically
      const userResponse = await axios.get(`${backendUrl}/user/user-data`, {
        withCredentials: true,
        // Prevent axios from treating 401 as an error (suppress console log)
        validateStatus: (status) => status < 500, // Don't throw error for 401, only for server errors
      });

      if (userResponse.status === 200 && userResponse.data.success) {
        setUserToken('authenticated');
        setUserData(userResponse.data.userData);
        setIsLogin(true);
      } else {
        // User not authenticated (401 or other non-success response)
        setUserToken(null);
        setUserData(null);
        setIsLogin(false);
        setUserApplication(null);
      }
    } catch (error) {
      // Only handle unexpected errors (network errors, server errors)
      // 401 errors are now handled above, so this catches only real errors
      setUserToken(null);
      setUserData(null);
      setIsLogin(false);
      setUserApplication(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Simple helper function to handle 401 errors
  // Call this in catch blocks of API calls to auto-logout on session expiry
  const handleAuthError = (error) => {
    if (error?.response?.status === 401 && isLogin) {
      setUserToken(null);
      setUserData(null);
      setIsLogin(false);
      setUserApplication(null);
      toast.error("Session expired. Please login again.");
      return true; // Indicates auth error was handled
    }
    return false; // Not an auth error
  };

  const fetchUserData = async () => {
    if (!userToken) return;
    setUserDataLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/user/user-data`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch user data."
        );
      }
    } finally {
      setUserDataLoading(false);
    }
  };


  const fetchJobsData = async () => {
    try {
      // Add timeout to prevent hanging and make it faster
      const { data } = await axios.get(`${backendUrl}/job/all-jobs`, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (data.success) {
        setJobs(data.jobData);
        setAppReady(true); // App is ready when jobs are loaded
      } else {
        console.error('Jobs fetch failed:', data.message);
        setAppReady(true);
      }
    } catch (error) {
      console.error('Jobs fetch error:', error);
      setAppReady(true);
    } finally {
      setJobLoading(false);
    }
  };

  const fetchUserApplication = async () => {
    try {
      setApplicationsLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/applications/user-applications`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUserApplication(data.jobApplications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setApplicationsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      // Clear local state first to prevent race conditions
      setUserToken(null);
      setUserData(null);
      setIsLogin(false);

      await axios.post(`${backendUrl}/user/logout-user`, {}, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      // Even if the request fails, local state is already cleared
      toast.success("Logged out successfully");
    }
  };

  // Fetch jobs immediately on app load
  useEffect(() => {
    fetchJobsData();
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (userToken) {
      setIsLogin(true);
      fetchUserData();
      fetchUserApplication(); // Fetch user applications when user is authenticated
    } else {
      setUserData(null);
      setIsLogin(false);
      setUserApplication(null); // Clear applications when user logs out
    }
  }, [userToken]);


  const value = {
    // Search
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,

    // Jobs
    jobs,
    setJobs,
    jobLoading,
    fetchJobsData,

    // Backend
    backendUrl,

    // User
    userToken,
    setUserToken,
    userData,
    setUserData,
    userDataLoading,
    isLogin,
    setIsLogin,
    fetchUserData,
    logoutUser,
    authLoading,
    handleAuthError, // Helper to handle 401 errors in components

    userApplication,
    applicationsLoading,
    fetchUserApplication,

    // App state
    appReady
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
