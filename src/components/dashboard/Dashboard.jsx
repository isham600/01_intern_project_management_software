import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Dropdown, Menu, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!storedUser || !storedUser.email) {
      message.warning("Please login first");
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      setTimeout(() => {
        message.success("Logout successful");
        navigate("/");
      }, 1000);
    } catch (error) {
      message.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col py-6 px-4">
        <h2 className="text-2xl font-bold mb-8">MyApp</h2>
        <ul className="space-y-4">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Dashboard
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Projects
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Tasks
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Reports
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-xl font-semibold">Dashboard</div>
          <div>
            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer border"
              />
            </Dropdown>
          </div>
        </div>

        {/* Dashboard Info */}
        <div className="p-8 bg-gray-100 flex flex-col items-start gap-4">
          {user && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user.email}
              </h1>
              <p className="text-lg text-gray-700">Username: {user.username}</p>
              <p className="text-lg text-gray-700">Role: {user.role}</p>
              <p className="text-lg text-gray-700">Phone No: {user.phone_no}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
