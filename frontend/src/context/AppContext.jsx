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
        // Cache the jobs data in localStorage for faster subsequent loads
        localStorage.setItem('cachedJobs', JSON.stringify(data.jobData));
        localStorage.setItem('jobsCacheTime', Date.now().toString());
        setAppReady(true); // App is ready when jobs are loaded
      } else {
        console.error('Jobs fetch failed:', data.message);
        // Try to load from cache if API fails
        loadJobsFromCache();
      }
    } catch (error) {
      console.error('Jobs fetch error:', error);
      // Try to load from cache if API fails
      loadJobsFromCache();
    } finally {
      setJobLoading(false);
    }
  };

  const loadJobsFromCache = () => {
    try {
      const cachedJobs = localStorage.getItem('cachedJobs');
      const cacheTime = localStorage.getItem('jobsCacheTime');
      
      // Use cache if it's less than 5 minutes old
      if (cachedJobs && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        setJobs(JSON.parse(cachedJobs));
        setAppReady(true); // App is ready when jobs are loaded from cache
        console.log('Loaded jobs from cache');
      } else {
        // No valid cache, app will be ready when API call completes
        setAppReady(true);
      }
    } catch (error) {
      console.error('Error loading jobs from cache:', error);
      setAppReady(true); // Set ready even if cache fails
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


  // Fetch jobs immediately on app load
  useEffect(() => {
    // Try to load from cache first for instant display
    const cachedJobs = localStorage.getItem('cachedJobs');
    const cacheTime = localStorage.getItem('jobsCacheTime');
    
    if (cachedJobs && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
      // Valid cache exists, load it immediately
      setJobs(JSON.parse(cachedJobs));
      setAppReady(true);
      console.log('Loaded jobs from cache immediately');
    } else {
      // No valid cache, fetch from API
      fetchJobsData();
    }
  }, []);

  useEffect(() => {
    if (document.cookie.includes('userToken=')) {
      fetchUserApplication();
    }
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
    fetchUserApplication,

    // App state
    appReady
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
