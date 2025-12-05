import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { Trash2, Eye, X, LoaderCircle } from "lucide-react";
import { assets } from "../assets/assets";

const ManageJobs = () => {
  const [manageJobData, setManageJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { backendUrl } = useContext(AppContext);

  const fetchManageJobsData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/job/recruiter-jobs`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setManageJobData(data.jobsData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const changeJobVisiblity = async (id) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/job/update/${id}`,
        {
          visible: !manageJobData.find(job => job._id === id)?.visible,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchManageJobsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        const { data } = await axios.delete(
          `${backendUrl}/job/delete/${id}`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success(data.message);
          fetchManageJobsData();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete job");
      }
    }
  };

  const viewJobApplications = async (job) => {
    setSelectedJob(job);
    setShowApplicationsModal(true);
    setApplicationsLoading(true);
    
    try {
      const { data } = await axios.get(
        `${backendUrl}/applications/job/${job._id}`,
        {
          withCredentials: true,
        }
      );
      
      if (data.success) {
        setJobApplications(data.applicationsData || []);
      } else {
        toast.error(data.message || "Failed to load applications");
        setJobApplications([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch applications");
      setJobApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingStatus(applicationId);
    try {
      const { data } = await axios.put(
        `${backendUrl}/applications/update-status/${applicationId}`,
        { status },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        // Update the local state
        setJobApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status } 
              : app
          )
        );
        // Refresh the main job data to update applicant count
        fetchManageJobsData();
      } else {
        // Check if the application was withdrawn
        if (error?.response?.status === 404) {
          toast.error("Application was withdrawn by the user");
          // Remove the withdrawn application from the list
          setJobApplications(prev => 
            prev.filter(app => app._id !== applicationId)
          );
          // Refresh the main job data to update applicant count
          fetchManageJobsData();
        } else {
          toast.error(data.message || "Failed to update status");
        }
      }
    } catch (error) {
      // Check if the application was withdrawn
      if (error?.response?.status === 404) {
        toast.error("Application was withdrawn by the user");
        // Remove the withdrawn application from the list
        setJobApplications(prev => 
          prev.filter(app => app._id !== applicationId)
        );
        // Refresh the main job data to update applicant count
        fetchManageJobsData();
      } else {
        toast.error(error?.response?.data?.message || "Error updating status");
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

  const closeModal = () => {
    setShowApplicationsModal(false);
    setSelectedJob(null);
    setJobApplications([]);
  };

  useEffect(() => {
    fetchManageJobsData();
  }, []);

  useEffect(() => {
    document.title = "Workio - Job Portal | Dashboard";
  }, []);

  return (
    <section>
      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : !manageJobData || manageJobData.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No jobs found.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          {" "}
          <table className="w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visible
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {manageJobData.map((job, index) => (
                <tr
                  key={job._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                    {job.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {job.applicants || 0}
                      </span>
                      <button
                        onClick={() => viewJobApplications(job)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="View applications"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <input
                      onChange={() => changeJobVisiblity(job._id)}
                      type="checkbox"
                      checked={job.visible}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Applications Modal */}
      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20 mx-2 sm:mx-0">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Applications for "{selectedJob?.title}"
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                  {selectedJob?.location} • {moment(selectedJob?.date).format("ll")}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[60vh]">
              {applicationsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader />
                </div>
              ) : jobApplications.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-gray-400 mb-4">
                    <Eye className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No applications found
                  </h3>
                  <p className="text-gray-500">
                    No applications found for this particular job.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {jobApplications.map((application, index) => (
                    <div
                      key={application._id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <img
                            src={application?.userId?.image || assets.profile_img}
                            alt={application?.userId?.name || "Applicant"}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = assets.profile_img;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                              {application?.userId?.name || "Unknown"}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Applied on {moment(application.date).format("ll")}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions Section - Mobile: Full width, Desktop: Right aligned */}
                        <div className="flex flex-col sm:flex-col items-stretch sm:items-end space-y-2 sm:space-y-2">
                          {updatingStatus === application._id ? (
                            <div className="flex items-center justify-center sm:justify-end">
                              <LoaderCircle className="animate-spin w-4 h-4 text-gray-500" />
                            </div>
                          ) : application.status === "Pending" ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(application._id, "Accepted")}
                                className="flex-1 sm:flex-none px-3 py-2 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                disabled={updatingStatus === application._id}
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application._id, "Rejected")}
                                className="flex-1 sm:flex-none px-3 py-2 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                                disabled={updatingStatus === application._id}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium text-center ${
                                application.status === "Accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {application.status}
                            </span>
                          )}
                          
                          {/* Resume Link */}
                          {application?.userId?.resume ? (
                            <a
                              href={application.userId.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center sm:justify-end text-xs text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Resume
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 text-center sm:text-right">No resume</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageJobs;
