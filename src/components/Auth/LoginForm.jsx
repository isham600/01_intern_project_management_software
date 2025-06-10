import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { message, Button, Typography } from "antd";
import { motion } from "framer-motion";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptcha({ num1, num2 });
    setCaptchaAnswer("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const onSubmit = async (data) => {
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      message.error("CAPTCHA incorrect. Please try again.");
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/auth/login",
        data,
        { withCredentials: true }
      );

      await new Promise((res) => setTimeout(res, 2000));

      localStorage.setItem(
        "token",
        JSON.stringify({
          user: response.data.user,
        })
      );

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      }

      message.success("Login success");
      navigate("/dashboard");
    } catch (error) {
      message.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/auth/googleLogin",
        {
          token: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      message.success("Google Login success");

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      // Check if the API sent a custom error message
      const apiMessage = error.response?.data?.message || "Google login failed";

      message.error("Google login failed: " + apiMessage);
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
          {/* Left - Image Section */}
          <div className="w-1/2 bg-gradient-to-br from-purple-200 to-indigo-300 p-6 hidden md:flex items-center justify-center">
            <img
              src="https://1000logos.net/wp-content/uploads/2021/05/Atlassian-Logo-2010s1.png"
              alt="Login illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right - Form Section */}
          <div className="w-full md:w-1/2 p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("identifier")}
                  type="text"
                  placeholder="Email / Phone"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {/* CAPTCHA Input with Refresh */}
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`What is ${captcha.num1} + ${captcha.num2}?`}
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Button onClick={generateCaptcha} icon="🔁" />
              </div>

              {/* Remember Me */}
              <div className="flex items-center mt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember Me
                </label>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isSubmitting}
                className="font-semibold"
              >
                Log In
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Text type="secondary">
                <span
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </Text>
            </div>

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
              New here?{" "}
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
