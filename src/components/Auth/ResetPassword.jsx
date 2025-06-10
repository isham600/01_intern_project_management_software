import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Statistic,
  Row,
  Col,
} from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const identifier = location.state?.identifier;
  const sessionId = location.state?.sessionId;

  const [deadline, setDeadline] = useState(Date.now() + 10 * 60 * 1000);

  if (!identifier) {
    message.error("No identifier provided. Please restart the reset process.");
    navigate("/forgot-password");
    return null;
  }

  const onFinish = async (values) => {
    if (expired) {
      message.error("Session expired. Please restart the reset process.");
      return;
    }
    if (!sessionId) {
      message.error("Missing session. Please restart the process.");
      navigate("/forgot-password");
      return;
    }
    const { newPassword } = values;
    setLoading(true);
    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 2000));
      const apiCall = axios.post("http://localhost:3000/api/user/auth/resetPassword", {
        identifier,
        newPassword,
        sessionId,
      });

      await Promise.all([apiCall, delay]);

      message.success("Password reset successful!");
      navigate("/");
    } catch (error) {
      message.error(
        "Failed to reset password: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    setReloadLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExpired(false);
    setDeadline(Date.now() + 10 * 60 * 1000);
    form.resetFields();
    message.info("Reset form reloaded. Please enter new password.");
    setReloadLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 px-4 py-8">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 sm:p-12"
      >
        <Title level={3} className="!text-center text-gray-800 mb-2">
          Reset Your Password
        </Title>
        <Text className="block text-center text-gray-600 mb-6">
          Set a new password for <b>{identifier}</b>
        </Text>

        <Row justify="center" style={{ marginBottom: 16 }}>
          <Col>
            <Countdown
              title="Session Expires In"
              value={deadline}
              format="mm:ss"
              onFinish={() => {
                setExpired(true);
                message.error(
                  "Session expired. Please restart the reset process."
                );
                navigate("/forgot-password");
              }}
            />
          </Col>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={expired}
        >
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password" },
              {
                pattern: passwordRegex,
                message:
                  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
              },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="New Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="!py-3 font-semibold"
              disabled={expired}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <div className="flex justify-between items-center mt-4">
          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={handleReload}
            disabled={!expired}
            loading={reloadLoading}
          >
            Reload
          </Button>

          <p className="text-sm text-gray-600">
            Changed your mind?{" "}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Back to Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
