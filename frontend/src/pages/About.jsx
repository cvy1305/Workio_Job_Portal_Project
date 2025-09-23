import React from "react";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <>
      <Navbar />
      <section>
        {/* About Section */}
        <div className="mt-16">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-gray-700">
            About Workio
          </h1>
          <div className="max-w-4xl text-center mx-auto space-y-6 text-gray-600">
            <p className="leading-relaxed">
              Workio is a comprehensive job portal designed to bridge the gap between talented job seekers and innovative companies. Our platform connects candidates with their dream jobs while helping recruiters find the perfect match for their teams.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're a fresh graduate looking to start your career or an experienced professional seeking new opportunities, Workio provides the tools and resources you need to succeed in today's competitive job market.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center bg-white p-6 rounded-xl border-2 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">For Job Seekers</h3>
                <p className="text-gray-600">Find relevant job opportunities, track applications, and get matched with companies that align with your skills and career goals.</p>
              </div>
              <div className="text-center bg-white p-6 rounded-xl border-2 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">For Recruiters</h3>
                <p className="text-gray-600">Post job openings, manage applications, and discover talented candidates who are the perfect fit for your organization.</p>
              </div>
              <div className="text-center bg-white p-6 rounded-xl border-2 border-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
                <p className="text-gray-600">To make job searching and hiring more efficient, transparent, and successful for everyone involved in the process.</p>
              </div>
            </div>
          </div>
        </div>

        <Testimonials />

        {/* How It Works Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3">
              How It Works?
            </h1>
            <p className="text-lg text-gray-500">Simple steps to find your perfect job match</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Work Step 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_1}
                  alt="Create Profile"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Create Your Profile
              </h3>
              <p className="text-gray-600">
                Sign up as a job seeker or recruiter, upload your resume or company logo, and complete your profile to get started.
              </p>
            </div>

            {/* Work Step 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_2}
                  alt="Search & Apply"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Search & Apply
              </h3>
              <p className="text-gray-600">
                Browse through thousands of job listings, filter by location and category, and apply to positions that match your skills and interests.
              </p>
            </div>

            {/* Work Step 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_3}
                  alt="Track Applications"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Track & Manage
              </h3>
              <p className="text-gray-600">
                Monitor your application status, manage job postings, and stay updated with real-time notifications throughout the hiring process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
