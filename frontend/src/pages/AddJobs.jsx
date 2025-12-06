import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../context/AppContext";
import axios from "../utils/axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const AddJob = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Programming");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("Intermediate");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleAuthError } = useContext(AppContext);

  const postJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/job/add", {
        title,
        description,
        category,
        location,
        level,
        salary: salary ? Number(salary) : 0,
      });

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
        setCategory("Programming");
        setLocation("");
        setLevel("Intermediate");
        setSalary("");

        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write job description here...",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
          ]
        }
      });

      quillRef.current.on('text-change', () => {
        const html = quillRef.current.root.innerHTML;
        setDescription(html);
      });
    }
  }, []);

  useEffect(() => {
    document.title = "Workio - Job Portal | Dashboard";
  }, []);

  return (
    <section className="mr-1 mb-6">
      <form onSubmit={postJob}>
        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            Job Title
          </label>
          <input
            type="text"
            placeholder="Enter job title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            Job Description
          </label>
          <div
            ref={editorRef}
            className="quill-editor"
            style={{
              minHeight: "200px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Job Category */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              Job Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Designing">Designing</option>
              <option value="Networking">Networking</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              Job Location
            </label>
            <input
              type="text"
              placeholder="Enter job location"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Job Level */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              Job Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              Salary
            </label>
            <input
              type="number"
              placeholder="in LPA"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 font-semibold rounded ${
            loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {loading ? (
            <LoaderCircle className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            "Add Job"
          )}
        </button>
      </form>
    </section>
  );
};

export default AddJob;
