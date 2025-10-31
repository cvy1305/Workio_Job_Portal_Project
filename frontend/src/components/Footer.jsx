import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout - Single Row */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                className="h-8 w-auto"
                src={assets.workio_logo}
                alt="Workio Logo"
              />
            </Link>
            <span className="text-gray-300">|</span>
            <p className="text-gray-600 text-sm">
              Copyright© All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Facebook"
            >
              <img
                src={assets.facebook_icon}
                alt="Facebook"
                className="h-5 w-5"
              />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <img
                src={assets.twitter_icon}
                alt="Twitter"
                className="h-5 w-5"
              />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Instagram"
            >
              <img
                src={assets.instagram_icon}
                alt="Instagram"
                className="h-5 w-5"
              />
            </a>
          </div>
        </div>

        {/* Mobile Layout - Single Line */}
        <div className="md:hidden py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img
                  className="h-5 w-auto"
                  src={assets.workio_logo}
                  alt="Workio Logo"
                />
              </Link>
              <span className="text-gray-300 text-xs">|</span>
              <p className="text-gray-500 text-xs">
                Copyright© All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <img
                  src={assets.facebook_icon}
                  alt="Facebook"
                  className="h-4 w-4"
                />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <img
                  src={assets.twitter_icon}
                  alt="Twitter"
                  className="h-4 w-4"
                />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <img
                  src={assets.instagram_icon}
                  alt="Instagram"
                  className="h-4 w-4"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
