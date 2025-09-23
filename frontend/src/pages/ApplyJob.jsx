import axios from "axios";
import { Clock, MapPin, User } from "lucide-react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const ApplyJob = () => {
  const [jobData, setJobData] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [noSimilarJobs, setNoSimilarJobs] = useState(false);
  const [showingOtherCompanies, setShowingOtherCompanies] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const {
    jobs,
    jobLoading,
    backendUrl,
    userToken,
    userData,
    userApplication = [],
    isLogin,
    fetchUserApplication,
  } = useContext(AppContext);

  const applyJob = async (jobId) => {
    try {
      if (!isLogin) {
        toast.error("Please log in to apply");
        navigate("/login");
        return;
      }
      if (!userData?.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume");
      }

      const { data } = await axios.post(
        `${backendUrl}/user/apply-job`,
        { jobId },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setAlreadyApplied(true);
        // Refresh user application data to keep it in sync
        fetchUserApplication();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (jobs && id) {
      const data = jobs.find((job) => job._id === id);
      setJobData(data);
    }
  }, [id, jobs]);

  useEffect(() => {
    if (jobData) {
      if (userApplication && userApplication.length > 0) {
        const hasApplied = userApplication.some(
          (item) => item?.jobId?._id === jobData?._id
        );
        setAlreadyApplied(hasApplied);
      } else {
        // If userApplication is null or empty, user hasn't applied to any jobs
        setAlreadyApplied(false);
      }
    }
  }, [jobData, userApplication]);

  useEffect(() => {
    if (jobs && jobData) {
      const currentCompanyName = jobData?.companyId?.name?.trim().toLowerCase();
      
      // First, try to find jobs from the same company
      const sameCompanyJobs = jobs.filter(
        (job) => {
          const jobCompanyName = job.companyId?.name?.trim().toLowerCase();
          return job._id !== jobData?._id && jobCompanyName === currentCompanyName;
        }
      );
      
      // Filter out applied jobs from same company
      const appliedJobsId = new Set(
        userApplication?.map((app) => app.jobId?._id) || []
      );
      
      const availableSameCompanyJobs = sameCompanyJobs.filter(job => !appliedJobsId.has(job._id));
      
      if (availableSameCompanyJobs.length > 0) {
        // Show jobs from same company
        setNoSimilarJobs(false);
        setShowingOtherCompanies(false);
      } else {
        // Fallback: show jobs from different companies that user hasn't applied to
        const otherCompanyJobs = jobs.filter(
          (job) => {
            const jobCompanyName = job.companyId?.name?.trim().toLowerCase();
            const isDifferentCompany = job._id !== jobData?._id && jobCompanyName !== currentCompanyName;
            const notApplied = !appliedJobsId.has(job._id);
            return isDifferentCompany && notApplied;
          }
        );
        
        if (otherCompanyJobs.length > 0) {
          setNoSimilarJobs(false);
          setShowingOtherCompanies(true);
        } else {
          setNoSimilarJobs(true);
          setShowingOtherCompanies(false);
        }
      }
    }
  }, [jobData, jobs, userApplication]);

  if (jobLoading || !jobData) {
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
        <div className="flex flex-col lg:flex-row justify-between border border-blue-200 rounded-lg bg-blue-50 p-8 lg:p-12 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 flex-shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              <img
                src={jobData?.companyId?.image || assets.company_icon}
                alt={jobData?.companyId?.name || "Company logo"}
                className="w-12 h-12 object-cover"
                onError={(e) => {
                  e.target.src = assets.company_icon;
                }}
              />
            </div>
            <div className="flex-1 mb-6 md:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-3">
                {jobData?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1.5">
                  <img src={assets.suitcase_icon} alt="Company" />
                  <span>{jobData?.companyId?.name || "Unknown Company"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User size={20} />
                  <span>{jobData?.level}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={19} />
                  <span>{jobData?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold text-lg">₹</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                    {jobData?.salary
                      ? `${jobData.salary} LPA`
                      : "Not disclosed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:mt-6 flex flex-col items-start gap-2.5">
            <button
              className={`${
                alreadyApplied
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white font-medium py-2 px-6 rounded-md transition duration-200 shadow-sm `}
              onClick={() => applyJob(jobData?._id)}
              disabled={alreadyApplied}
            >
              {alreadyApplied ? "Already Applied" : "Apply now"}
            </button>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock size={18} />
              <span>Posted {moment(jobData?.date).fromNow()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 xl:w-2/3">
            <h1 className="text-2xl font-bold mb-6 text-gray-700">
              Job Description
            </h1>
            <div
              className="job-description text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: jobData?.description }}
            />
          </div>

          <div className="w-full lg:w-1/2 xl:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {showingOtherCompanies ? (
                "Other Jobs"
              ) : (
                <>
                  Other Jobs at{" "}
                  <span className="text-blue-600">
                    {jobData?.companyId?.name || "Company"}
                  </span>
                </>
              )}
            </h2>
            <div className="space-y-4">
              {noSimilarJobs ? (
                <p className="text-gray-600">
                  No other jobs available at the moment.
                </p>
              ) : (
                jobs
                  .filter((job) => {
                    const currentCompanyName = jobData?.companyId?.name?.trim().toLowerCase();
                    const jobCompanyName = job.companyId?.name?.trim().toLowerCase();
                    const appliedJobsId = new Set(
                      userApplication?.map((app) => app.jobId?._id) || []
                    );
                    
                    if (showingOtherCompanies) {
                      // Show jobs from different companies that user hasn't applied to
                      return job._id !== jobData?._id && 
                             jobCompanyName !== currentCompanyName && 
                             !appliedJobsId.has(job._id);
                    } else {
                      // Show jobs from same company that user hasn't applied to
                      return job._id !== jobData?._id && 
                             jobCompanyName === currentCompanyName && 
                             !appliedJobsId.has(job._id);
                    }
                  })
                  .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (latest first)
                  .slice(0, 3)
                  .map((job) => <JobCard job={job} key={job._id} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ApplyJob;
