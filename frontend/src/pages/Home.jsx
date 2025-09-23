import React, { useContext, useEffect, useState } from "react";
import FeaturedJob from "../components/FeaturedJob";
import Hero from "../components/Hero";
import JobCategoryt from "../components/JobCategory";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import Counter from "../components/Counter";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const { fetchJobsData, isLogin, isCompanyLogin } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      // If same category is clicked, clear the filter
      setSelectedCategory(null);
    } else {
      // Set new category
      setSelectedCategory(category);
    }
    
    // Scroll to featured jobs section
    setTimeout(() => {
      const featuredSection = document.getElementById('featured-jobs');
      if (featuredSection) {
        featuredSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <JobCategoryt onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
      <FeaturedJob selectedCategory={selectedCategory} />
      {/* Only show Counter section for non-logged-in users */}
      {!isLogin && !isCompanyLogin && <Counter />}
      {/* Only show Testimonials for non-logged-in users */}
      {!isLogin && !isCompanyLogin && <Testimonials />}
    </>
  );
};

export default Home;
