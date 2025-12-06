import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Mail, Lock } from "lucide-react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";
import SignupPopup from "../components/SignupPopup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);

  const navigate = useNavigate();
  const { setUserData, setUserToken, setIsLogin } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/user/login-user", {
        email,
        password,
        userType,
      });

      if (data.success) {

        setUserToken('authenticated');
        setUserData(data.userData);
        setIsLogin(true);
        toast.success(data.message);

        // Redirect based on user type
        if (data.userData.userType === 'recruiter') {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
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
                Login
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back ! Please login to continue
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-3">
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

                <div className="border border-gray-300 rounded flex items-center p-2.5">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* User Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm text-gray-700">
                    I am a:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="candidate"
                        checked={userType === "candidate"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Candidate</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="recruiter"
                        checked={userType === "recruiter"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Recruiter</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center cursor-pointer ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5" />
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignupPopupOpen(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                >
                  Create one here
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      
      {/* Signup Popup */}
      <SignupPopup 
        isOpen={isSignupPopupOpen} 
        onClose={() => setIsSignupPopupOpen(false)} 
      />
    </>
  );
};

export default Login;
