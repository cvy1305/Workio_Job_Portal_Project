import React from "react";
import { X, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignupPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCandidateSignup = (e) => {
    e.preventDefault();
    onClose();
    navigate("/candidate-signup");
  };

  const handleRecruiterSignup = (e) => {
    e.preventDefault();
    onClose();
    navigate("/recruiter-signup");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 text-center">
          Choose how you want to sign up
        </p>
        
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleCandidateSignup}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all group cursor-pointer"
            style={{ 
              '--hover-border-color': '#1267DE',
              '--hover-bg-color': '#f0f4ff'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#1267DE';
              e.target.style.backgroundColor = '#f0f4ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <div className="p-3 rounded-full transition-colors" style={{ backgroundColor: '#f0f4ff' }}>
              <User className="h-6 w-6" style={{ color: '#1267DE' }} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Sign up as Candidate</h3>
              <p className="text-sm text-gray-600">Find and apply for jobs</p>
            </div>
          </button>
          
          <button
            type="button"
            onClick={handleRecruiterSignup}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all group cursor-pointer"
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#1267DE';
              e.target.style.backgroundColor = '#f0f4ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <div className="p-3 rounded-full transition-colors" style={{ backgroundColor: '#f0f4ff' }}>
              <Building2 className="h-6 w-6" style={{ color: '#1267DE' }} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Sign up as Recruiter</h3>
              <p className="text-sm text-gray-600">Post jobs and manage applications</p>
            </div>
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
              className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: '#1267DE' }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPopup;
