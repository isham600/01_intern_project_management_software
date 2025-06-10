import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Statistic } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const VerifyOtp = ({ identifier, sessionId }) => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();
  const [deadline, setDeadline] = useState(Date.now() + 5 * 60 * 1000); // 5 minutes

  const [form] = Form.useForm();

  useEffect(() => {
    // Reset timer and states when identifier/sessionId changes
    setDeadline(Date.now() + 5 * 60 * 1000);
    setExpired(false);
    setResendEnabled(false);
  }, [identifier, sessionId]);

  // Enable resend button once countdown finishes
  const onCountdownFinish = () => {
    setExpired(true);
    setResendEnabled(true);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const apiCall = axios.post("http://localhost:3000/api/user/auth/verifyOTP", {
        identifier,
        otp: values.otp,
        sessionId,
      });

      await Promise.all([apiCall, delay]);

      message.success("OTP verified!");

      setTimeout(() => {
        navigate("/reset-password", { state: { identifier, sessionId } });
      }, 2000);
    } catch (error) {
      message.error(
        "OTP verification failed: " +
          (error.response?.data?.message || error.message)
      );
      setTimeout(() => {
        form.resetFields(["otp"]);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!resendEnabled) return; // Prevent clicking if not enabled

    setResendLoading(true);
    try {
      // Create a promise that resolves after 2 seconds
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      // Create the API call promise
      const apiCall = axios.post("http://localhost:3000/user/forgotPassword", {
        identifier,
      });

      // Wait for both API call and delay to complete
      await Promise.all([apiCall, delay]);

      message.success("OTP resent! Please check your email or phone.");

      // Reset timer and disable resend button again
      setDeadline(Date.now() + 5 * 60 * 100);
      setExpired(false);
      setResendEnabled(false);
      form.resetFields(["otp"]);
    } catch (error) {
      message.error(
        "Failed to resend OTP: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white shadow-xl w-full max-w-md mx-auto">
      <Title level={3} className="text-center text-gray-800 mb-2">
        Verify OTP
      </Title>

      <Text className="block text-center text-gray-600 mb-4">
        Enter the 6-digit OTP sent to <b>{identifier}</b>
      </Text>

      <div className="flex justify-center mb-4">
        <Text className="text-sm text-gray-500 font-medium mr-2">
          OTP Expires In:
        </Text>
        <Countdown
          value={deadline}
          format="mm:ss"
          onFinish={onCountdownFinish}
          valueStyle={{ fontSize: 16, color: "#1890ff", fontWeight: 600 }}
        />
      </div>

      {expired && (
        <Text type="danger" className="block text-center mb-4 font-medium">
          OTP expired. You can resend OTP now.
        </Text>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={expired}
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please enter the OTP" },
            { len: 6, message: "OTP must be 6 digits" },
          ]}
        >
          <Input size="large" maxLength={6} placeholder="Enter OTP" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={expired}
            block
            className="!py-3 font-semibold text-lg"
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>

      {/* Resend OTP button always visible but disabled until countdown ends */}
      <Button
        type="default"
        onClick={handleResend}
        loading={resendLoading}
        disabled={!resendEnabled || resendLoading}
        block
        className="!py-3 font-semibold text-lg mt-2"
      >
        Resend OTP
      </Button>

      <div className="flex justify-between items-center mt-6">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setExpired(false);
            navigate(-1);
          }}
          className="text-blue-600 font-semibold !p-0"
        >
          Change Email
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
