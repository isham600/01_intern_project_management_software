import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { message, Button, Typography } from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/user/auth/register", data);
      message.success("Signup success");

      setTimeout(() => {
        navigate("/");
      }, 2000); // Delay navigation
    } catch (error) {
      message.error(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000); // Keep button in loading state for 2 seconds
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/googleLogin",
        {
          token: credentialResponse.credential,
        }
      );
      message.success("Google Login success");
      localStorage.setItem(
        "token",
        JSON.stringify({
          email: response.data.user.email,
          role: response.data.user.role,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      message.error("Google login failed" + error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="407928983617-52ufnu3ha2qt1cfru84nhjbck4d50hol.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 px-4 py-8">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex w-full max-w-5xl"
        >
          {/* Left Image Section */}
          <div className="w-1/2 bg-gradient-to-br from-purple-200 to-indigo-300 p-6 hidden md:flex items-center justify-center">
            <img
              src="https://1000logos.net/wp-content/uploads/2021/05/Atlassian-Logo-2010s1.png"
              alt="Signup illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 overflow-y-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Create Your Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  placeholder="Username"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && (
                  <Text type="danger" className="text-sm mt-1 block">
                    {errors.username.message}
                  </Text>
                )}
              </div>

              {/* Phone Number */}
              <div className="relative">
                <PhoneOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("phone_no", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                  type="text"
                  placeholder="Phone Number"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone_no && (
                  <Text type="danger" className="text-sm mt-1 block">
                    {errors.phone_no.message}
                  </Text>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <Text type="danger" className="text-sm mt-1 block">
                    {errors.email.message}
                  </Text>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                      message:
                        "Must include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                {errors.password && (
                  <Text type="danger" className="text-sm mt-1 block">
                    {errors.password.message}
                  </Text>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
                {errors.confirmPassword && (
                  <Text type="danger" className="text-sm mt-1 block">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="font-semibold"
              >
                Create Account
              </Button>
            </form>

            <div className="my-6 text-center">
              <Text>Or</Text>
              <div className="mt-3 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => message.error("Google login error")}
                />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Sign In
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignupForm;
