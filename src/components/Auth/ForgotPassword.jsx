import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import VerifyOtp from "./VerifyOtp";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [backLoading, setBackLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/auth/forgotPassword",
        {
          identifier: values.identifier,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const sessionIdFromBackend = res.data.sessionId;
      setIdentifier(values.identifier);
      setSessionId(sessionIdFromBackend);
      setStep(2);

      message.success("OTP sent! Please check your email or phone.");
    } catch (error) {
      message.error(
        "Error: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setBackLoading(true);
      setTimeout(() => {
        setBackLoading(false);
        setStep(1);
      }, 2000);
    } else {
      navigate("/"); // back to login page
    }
  };

  const handleOtpSuccess = () => {
    message.success("OTP Verified! Redirecting to reset password...");
    // Add redirection to reset password page if needed
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 px-4 py-8"
    >
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Back Button for Both Steps */}
        <Button
          icon={<ArrowLeftOutlined />}
          loading={backLoading}
          type="link"
          onClick={handleBack}
          style={{ marginBottom: 16, paddingLeft: 0, display: "inline-flex" }}
        >
          Back
        </Button>

        {step === 1 ? (
          <>
            <Title level={2} className="text-center text-gray-800 mb-2">
              Forgot Password
            </Title>
            <Text className="block text-center text-gray-600 mb-6">
              Enter your registered <b>Email-ID</b>
            </Text>

            <Form layout="vertical" onFinish={handleSendOtp}>
              <Form.Item
                name="identifier"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email-ID",
                  },
                  {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\d{10}$/,
                    message: "Enter a valid email-ID",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter Email-ID" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="!py-3 font-semibold text-lg"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <VerifyOtp
            identifier={identifier}
            sessionId={sessionId}
            onSuccess={handleOtpSuccess}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
