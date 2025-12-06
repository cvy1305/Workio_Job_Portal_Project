import axios from "../utils/axios";
import { LoaderCircle, Lock, Mail, Upload, UserRound, Info, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";

const CandidatesSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const navigate = useNavigate();
  const { setUserData, setUserToken, setIsLogin } = useContext(AppContext);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  useEffect(() => {
    setPasswordValid(password.length >= 8);
  }, [password]);

  const userSignupHanlder = async (e) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("userType", "candidate");
      formData.append("image", image);

      const { data } = await axios.post("/user/register-user", formData);

      if (data.success) {
        setUserToken('authenticated'); // Set authentication flag
        setUserData(data.userData);
        setIsLogin(true);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-700 mb-1">
                Candidate Signup
              </h1>
              <p className="text-sm text-gray-600">
                Welcome! Please sign up to continue
              </p>
            </div>

            <form className="space-y-4" onSubmit={userSignupHanlder}>
              <div className="flex flex-col items-center mb-4">
                <label className="relative cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <span className="block text-xs text-center mt-2 text-gray-500">
                    {image ? "Change photo" : "Upload your photo"}
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-300 rounded flex items-center p-2.5">
                  <UserRound className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="border border-gray-300 rounded flex items-center p-2.5">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="border border-gray-300 rounded flex items-center p-2.5">
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  {(passwordFocused || password.length > 0) && (
                    <p className={`text-xs ${passwordValid ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValid ? 'Password looks good' : 'Password must be at least eight characters.'}
                    </p>
                  )}
                </div>
              </div>

              <label
                htmlFor="terms-checkbox"
                className="flex items-center gap-1 cursor-pointer text-sm text-gray-600"
              >
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  required
                />
                I agree to the terms and conditions
                <Info 
                  className="h-3 w-3 text-gray-500 ml-1 cursor-pointer hover:text-blue-600 transition-colors" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsPopup(true);
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={loading || !passwordValid}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center cursor-pointer ${
                  loading || !passwordValid ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5" />
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Terms and Conditions Popup */}
      {showTermsPopup && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-lg rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto mx-4 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Terms and Conditions</h2>
              <button
                onClick={() => setShowTermsPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600 space-y-4">
              <p><strong>1. Acceptance of Terms</strong></p>
              <p>By accessing and using Workio, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <p><strong>2. Use License</strong></p>
              <p>Permission is granted to temporarily download one copy of Workio per device for personal, non-commercial transitory viewing only.</p>
              
              <p><strong>3. Privacy Policy</strong></p>
              <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.</p>
              
              <p><strong>4. Account Security</strong></p>
              <p>You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party.</p>
              
              <p><strong>5. Contact Information</strong></p>
              <p>If you have any questions about these Terms and Conditions, please contact us at support@workio.com</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTermsPopup(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidatesSignup;
