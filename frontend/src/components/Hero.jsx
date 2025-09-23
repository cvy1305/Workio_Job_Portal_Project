import React, { useContext, useRef, useState, useEffect, useMemo } from "react";
import { Search, MapPin } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AutocompleteInput from "./AutocompleteInput";

const Hero = () => {
  const navigate = useNavigate();

  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [searchInput, setSearchInput] = useState({
    title: "",
    location: ""
  });
  const [showError, setShowError] = useState(false);

  const { setSearchFilter, setIsSearched, backendUrl } = useContext(AppContext);

  const fetchJobCount = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/job/all-jobs`);
      if (data.success) {
        setJobCount(data.jobData.length);
        setJobs(data.jobData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Generate suggestions from job data
  const titleSuggestions = useMemo(() => {
    if (!jobs?.length) return [];
    const titles = [...new Set(jobs.map(job => job.title))];
    return titles.sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const locationSuggestions = useMemo(() => {
    if (!jobs?.length) return [];
    const locations = [...new Set(jobs.map(job => job.location))];
    return locations.sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  useEffect(() => {
    fetchJobCount();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInput(prev => ({ ...prev, [name]: value }));
  };

  const searchHandler = (e) => {
    e.preventDefault();

    // Check if both fields are empty
    if (!searchInput.title.trim() && !searchInput.location.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000); // Hide error after 3 seconds
      return;
    }

    setShowError(false);
    setSearchFilter({
      title: searchInput.title,
      location: searchInput.location,
    });

    setIsSearched(true);
    navigate("/all-jobs/all");
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg py-16 px-6 md:px-20">
      <div className="text-center max-w-2xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700 mb-4 leading-tight sm:leading-snug">
          There Are <span className="text-blue-700">
            {loading ? "..." : jobCount.toLocaleString()}
          </span> Postings Here
          For You!
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 mb-10">
          Your next big career move starts right here — explore the best job
          opportunities and take the first step toward your future!
        </p>

        {/* Search Form */}
        <form
          onSubmit={searchHandler}
          className="bg-white rounded-lg shadow p-3 flex flex-col sm:flex-row gap-4 sm:gap-2 items-stretch sm:items-center w-full"
        >
          {/* Job Title Input */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 md:py-2.5 bg-white w-full">
            <Search className="text-gray-400 mr-2 shrink-0" />
            <AutocompleteInput
              name="title"
              value={searchInput.title}
              onChange={handleInputChange}
              placeholder="Title"
              suggestions={titleSuggestions}
              className="w-full outline-none text-sm bg-transparent placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 md:py-2.5 bg-white w-full">
            <MapPin className="text-gray-400 mr-2 shrink-0" />
            <AutocompleteInput
              name="location"
              value={searchInput.location}
              onChange={handleInputChange}
              placeholder="Location"
              suggestions={locationSuggestions}
              className="w-full outline-none text-sm bg-transparent placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

          {/* Search Icon Button */}
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2.5 md:py-3 px-4 rounded-md transition-colors duration-200 cursor-pointer"
            title="Search jobs"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Error Message */}
        {showError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">
              Please enter a job title or location to search
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
