import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, '');

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

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
    
    // Check for token cookie only
    const hasTokenCookie = document.cookie.includes('userToken=');
    
    if (!hasTokenCookie) {
      setAuthLoading(false);
      return; // No token, skip authentication check
    }

    try {
      // Check user authentication
      const userResponse = await axios.get(`${backendUrl}/user/user-data`, {
        withCredentials: true,
      });
      
      if (userResponse.data.success) {
        setUserToken('authenticated');
        setUserData(userResponse.data.userData);
        setIsLogin(true);
        // Fetch user applications when user is authenticated on app load
        fetchUserApplication();
      }
    } catch (error) {
      // User not authenticated, this is normal - don't log 401 errors
      if (error.response?.status !== 401) {
      }
    } finally {
      setAuthLoading(false);
    }
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
      toast.error(
        error?.response?.data?.message || "Failed to fetch user data."
      );
    } finally {
      setUserDataLoading(false);
    }
  };


  const fetchJobsData = async () => {
    setJobLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/job/all-jobs`);
      if (data.success) {
        setJobs(data.jobData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setJobLoading(false);
    }
  };

  const fetchUserApplication = async () => {
    try {
      setApplicationsLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/user/get-user-applications`,
        {},
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
      toast.error(error?.response?.data?.message);
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


  useEffect(() => {
    if (document.cookie.includes('userToken=')) {
      fetchUserApplication();
    }
  }, []);

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

    userApplication,
    applicationsLoading,
    fetchUserApplication
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
