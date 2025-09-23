import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryIcon } from "../assets/assets";

const JobCategory = ({ onCategorySelect, selectedCategory }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleClick = useCallback(
    (index, name) => {
      setActiveIndex(index);
      setTimeout(() => setActiveIndex(null), 150);
      
      // If onCategorySelect is provided, use it for filtering
      if (onCategorySelect) {
        onCategorySelect(name);
      } else {
        // Default behavior: navigate to all-jobs page
        navigate(`/all-jobs/${encodeURIComponent(name)}`);
        window.scrollTo(0, 0);
      }
    },
    [navigate, onCategorySelect]
  );

  return (
    <section className="mt-24">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Popular Job Categories
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover top job categories tailored to your skills and career goals.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
        {Array.isArray(categoryIcon) &&
          categoryIcon.map((icon, index) => {
            const isActive = activeIndex === index;
            const isSelected = selectedCategory === icon.name;
            return (
              <div
                key={index}
                onClick={() => handleClick(index, icon.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleClick(index, icon.name);
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive || isSelected}
                className={`relative group bg-white p-4 md:p-6 rounded-lg md:rounded-md border shadow hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${
                  isSelected 
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                    : isActive 
                    ? "scale-[0.98] bg-blue-50 border-blue-200" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="bg-blue-50 p-3 rounded-full mb-3 md:mb-4 transition-transform group-hover:scale-105">
                  <img
                    className="w-7 h-7 md:w-8 md:h-8"
                    src={icon.icon}
                    alt={icon.name}
                    title={icon.name}
                    loading="lazy"
                  />
                </div>
                <span className="font-medium text-gray-700 text-sm">
                  {icon.name}
                </span>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default JobCategory;
