import { ChevronLeft, ChevronRight, Filter, RotateCcw } from "lucide-react";
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobCategories, JobLocations } from "../assets/assets";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import AutocompleteInput from "../components/AutocompleteInput";

function AllJobs() {
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const popupRef = useRef(null);

  const {
    jobs,
    searchFilter,
    setSearchFilter,
    setIsSearched,
    isSearched,
    fetchJobsData,
  } = useContext(AppContext);

  const { category } = useParams();
  const navigate = useNavigate();

  const jobsPerPage = 6;

  const [searchInput, setSearchInput] = useState({
    title: "",
    location: "",
    selectedCategory: "",
    selectedLocation: "",
  });

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
    const fetchData = async () => {
      setLoading(true);
      await fetchJobsData();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle click outside popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  useEffect(() => {
    if (!jobs?.length) return;

    let filtered = [...jobs];

    if (category !== "all") {
      filtered = filtered.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
    }

    setJobData(filtered);
    setSearchInput({
      title: isSearched ? searchFilter.title : "",
      location: isSearched ? searchFilter.location : "",
      selectedCategory: "",
      selectedLocation: "",
    });

    setCurrentPage(1);
  }, [category, jobs, isSearched, searchFilter]);

  useEffect(() => {
    let results = [...jobData];

    if (searchInput.title.trim()) {
      results = results.filter((job) =>
        job.title.toLowerCase().includes(searchInput.title.trim().toLowerCase())
      );
    }

    if (searchInput.location.trim()) {
      results = results.filter((job) =>
        job.location
          .toLowerCase()
          .includes(searchInput.location.trim().toLowerCase())
      );
    }

    if (searchInput.selectedCategory) {
      results = results.filter((job) =>
        job.category === searchInput.selectedCategory
      );
    }

    if (searchInput.selectedLocation) {
      results = results.filter((job) =>
        job.location === searchInput.selectedLocation
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [jobData, searchInput]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat) => {
    if (searchInput.selectedCategory === cat) {
      // If clicking on already selected category, reset all filters
      clearAllFilters();
    } else {
      // If clicking on different category, select it (single selection)
      setSearchInput((prev) => ({
        ...prev,
        selectedCategory: cat,
      }));
    }
  };


  const handleLocationSelect = (loc) => {
    if (searchInput.selectedLocation === loc) {
      // If clicking on already selected location, reset all filters
      clearAllFilters();
    } else {
      // If clicking on different location, select it
      setSearchInput((prev) => ({
        ...prev,
        selectedLocation: loc,
      }));
    }
  };

  const clearAllFilters = () => {
    setSearchInput({
      title: "",
      location: "",
      selectedCategory: "",
      selectedLocation: "",
    });
    setSearchFilter({ title: "", location: "" });
    setIsSearched(false);
    navigate("/all-jobs/all");
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = useMemo(() => {
    return [...filteredJobs]
      .slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);
  }, [filteredJobs, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <section>
        {/* Mobile Filter Button - Moved to left side above title */}
        <div className="md:hidden flex justify-start mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition text-sm"
          >
            <Filter size={16} />
            {showFilters ? "Hide" : "Filters"}
          </button>
        </div>

        {/* Mobile Glassy Popup for Filters */}
        {showFilters && (
          <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div ref={popupRef} className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-w-sm w-full max-h-[90vh] overflow-hidden border border-white/20">
              {/* Popup Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Popup Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      Job Title
                    </h3>
                    <AutocompleteInput
                      name="title"
                      value={searchInput.title}
                      onChange={handleSearchChange}
                      placeholder="Enter title"
                      suggestions={titleSuggestions}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      Job Location
                    </h3>
                    <AutocompleteInput
                      name="location"
                      value={searchInput.location}
                      onChange={handleSearchChange}
                      placeholder="Enter location"
                      suggestions={locationSuggestions}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      Categories
                    </h3>
                    <ul className="space-y-2">
                      {JobCategories.map((cat, i) => (
                        <li key={i} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-cat-${i}`}
                            checked={searchInput.selectedCategory === cat}
                            onChange={() => handleCategorySelect(cat)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-cat-${i}`}
                            className={`ml-2 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors text-sm ${
                              searchInput.selectedCategory === cat ? "font-semibold text-blue-600" : ""
                            }`}
                          >
                            {cat}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      Locations
                    </h3>
                    <ul className="space-y-2">
                      {JobLocations.map((loc, i) => (
                        <li key={i} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-loc-${i}`}
                            checked={searchInput.selectedLocation === loc}
                            onChange={() => handleLocationSelect(loc)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <label
                            htmlFor={`mobile-loc-${i}`}
                            className={`ml-2 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors text-sm ${
                              searchInput.selectedLocation === loc ? "font-semibold text-blue-600" : ""
                            }`}
                          >
                            {loc}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-16">
          {/* Desktop Filters */}
          <div className="hidden md:block lg:w-1/4 p-4 rounded-lg border border-gray-200">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Job Title
                </h2>
                <AutocompleteInput
                  name="title"
                  value={searchInput.title}
                  onChange={handleSearchChange}
                  placeholder="Enter title"
                  suggestions={titleSuggestions}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Job Location
                </h2>
                <AutocompleteInput
                  name="location"
                  value={searchInput.location}
                  onChange={handleSearchChange}
                  placeholder="Enter location"
                  suggestions={locationSuggestions}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Categories
                </h2>
                <ul className="space-y-2">
                  {JobCategories.map((cat, i) => (
                    <li key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${i}`}
                        checked={searchInput.selectedCategory === cat}
                        onChange={() => handleCategorySelect(cat)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`cat-${i}`}
                        className={`ml-2 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ${
                          searchInput.selectedCategory === cat ? "font-semibold text-blue-600" : ""
                        }`}
                      >
                        {cat}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Locations
                </h2>
                <ul className="space-y-2">
                  {JobLocations.map((loc, i) => (
                    <li key={i} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`loc-${i}`}
                        checked={searchInput.selectedLocation === loc}
                        onChange={() => handleLocationSelect(loc)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`loc-${i}`}
                        className={`ml-2 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors ${
                          searchInput.selectedLocation === loc ? "font-semibold text-blue-600" : ""
                        }`}
                      >
                        {loc}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-700 capitalize">
                {category === "all"
                  ? "Latest All Jobs"
                  : `Jobs in ${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    }`}
                {filteredJobs.length > 0 && (
                  <span className="ml-2 text-gray-500 text-lg">
                    ({filteredJobs.length}{" "}
                    {filteredJobs.length === 1 ? "job" : "jobs"})
                  </span>
                )}
              </h1>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
              <p className="text-gray-600">
                Get your desired job from top companies
              </p>
            </div>

            <div className="space-y-4">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, i) => <JobCard key={i} job={job} />)
              ) : (
                <div className="text-center bg-white p-6 border border-gray-200 rounded-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-3">
                    Try adjusting your search filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-md border text-center cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-blue-50 text-blue-500 border-blue-300"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default AllJobs;
