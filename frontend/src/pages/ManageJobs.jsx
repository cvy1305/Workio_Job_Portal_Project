import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

const ManageJobs = () => {
  const [manageJobData, setManageJobData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { backendUrl, handleAuthError } = useContext(AppContext);

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
      // Check if it's a 401 error and handle logout
      if (!handleAuthError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
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
      if (!handleAuthError(error)) {
        toast.error(error?.response?.data?.message);
      }
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
        if (!handleAuthError(error)) {
          toast.error(error?.response?.data?.message || "Failed to delete job");
        }
      }
    }
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
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-medium">
                      {job.applicants || 0}
                    </span>
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
    </section>
  );
};

export default ManageJobs;
