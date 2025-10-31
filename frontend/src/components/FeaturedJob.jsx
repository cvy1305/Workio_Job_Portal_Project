import React, { useContext, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import JobCard from "./JobCard";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const FeaturedJob = ({ selectedCategory }) => {
  const { jobs, jobLoading } = useContext(AppContext);
  const navigate = useNavigate();

  // Filter jobs based on selected category
  const filteredJobs = useMemo(() => {
    if (!selectedCategory || !Array.isArray(jobs)) {
      return jobs || [];
    }
    
    return jobs.filter(job => 
      job.category && job.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [jobs, selectedCategory]);

  return (
    <section id="featured-jobs" className="mt-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          {selectedCategory ? `${selectedCategory} Jobs` : "Featured Jobs"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {selectedCategory 
            ? `Discover the latest ${selectedCategory.toLowerCase()} opportunities` 
            : "Know your worth and find the job that qualifies your life"
          }
        </p>
      </div>
      {jobLoading ? (
        <div className="flex items-center justify-center mt-10">
          <Loader />
        </div>
      ) : !Array.isArray(filteredJobs) || filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500">
          {selectedCategory ? `No ${selectedCategory.toLowerCase()} jobs found` : "No jobs found"}
        </p>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {[...filteredJobs]
              .slice(0, 10) // Show 10 jobs on mobile
              .map((job, index) => (
                <JobCard job={job} key={job.id || index} />
              ))}
          </div>
          
          {/* Show additional 2 jobs on desktop (hidden on mobile) */}
          <div className="hidden md:grid gap-4 grid-cols-2 mt-4">
            {[...filteredJobs]
              .slice(10, 12) // Show additional 2 jobs on desktop (total 12)
              .map((job, index) => (
                <JobCard job={job} key={job.id || index + 10} />
              ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => {
                navigate(selectedCategory ? `/all-jobs/${encodeURIComponent(selectedCategory)}` : "/all-jobs/all");
                window.scrollTo(0, 0);
              }}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              See more
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedJob;
