

// import React, { useRef, useState, useEffect } from "react";
// import {
//   Layout,
//   Input,
//   Dropdown,
//   Space,
//   Avatar,
//   Typography,
//   Badge,
//   message,
//   Drawer,
//   Button,
//   Menu,
// } from "antd";
// import {
//   UserOutlined,
//   LogoutOutlined,
//   DownOutlined,
//   SettingOutlined,
//   BellOutlined,
//   EditOutlined,
//   SearchOutlined,
//   PlusOutlined,
//   FolderOpenOutlined,
// } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../../assets/jira.png";

// const { Header } = Layout;
// const { Search } = Input;
// const { Text } = Typography;

// const Navbar = () => {
//   const [profileImage, setProfileImage] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showSearchDrawer, setShowSearchDrawer] = useState(false);
//   const fileInputRef = useRef();
//   const navigate = useNavigate();
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const savedImage = localStorage.getItem("profileImage");
//     const storedUser =
//       JSON.parse(localStorage.getItem("user")) ||
//       JSON.parse(sessionStorage.getItem("user"));

//     if (savedImage) setProfileImage(savedImage);
//     if (storedUser) setUser(storedUser);

//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       message.error("Please select a valid image file.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64 = reader.result;
//       setProfileImage(base64);
//       localStorage.setItem("profileImage", base64);
//       message.success("Profile picture updated!");
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       await axios.get("http://localhost:3000/user/logout", {
//         withCredentials: true,
//       });

//       localStorage.clear();
//       sessionStorage.clear();

//       setTimeout(() => {
//         setLoading(false);
//         message.success("Logout successful");
//         navigate("/");
//       }, 1000);
//     } catch (error) {
//       setLoading(false);
//       message.error("Logout failed");
//       console.error("Logout error:", error);
//     }
//   };

//   const userMenuItems = [
//     {
//       key: "profile",
//       label: (
//         <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <UserOutlined />
//           Profile
//         </Link>
//       ),
//     },
//     {
//       key: "settings",
//       label: (
//         <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <SettingOutlined />
//           Settings
//         </Link>
//       ),
//     },
//     {
//       key: "logout",
//       label: (
//         <div
//           onClick={handleLogout}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             color: "red",
//             cursor: "pointer",
//             paddingLeft: 12,
//             paddingRight: 12,
//           }}
//         >
//           <LogoutOutlined />
//           Logout
//         </div>
//       ),
//     },
//   ];

//   const userDropdownContent = {
//     items: [
//       {
//         key: "user-info",
//         label: (
//           <div style={{ padding: "8px 12px", textAlign: "center" }}>
//             <Avatar
//               size={64}
//               src={profileImage}
//               icon={!profileImage && <UserOutlined />}
//               style={{ marginBottom: 8 }}
//             />
//             <div>
//               <Text strong>{user?.username || "User Name"}</Text>
//               <br />
//               <Text type="secondary" style={{ fontSize: 12 }}>
//                 {user?.email || "user@example.com"}
//               </Text>
//               {user?.role && (
//                 <>
//                   <br />
//                   <Text style={{ fontSize: 12 }}>Role: {user.role}</Text>
//                 </>
//               )}
//               {user?.phone_no && (
//                 <>
//                   <br />
//                   <Text style={{ fontSize: 12 }}>Phone: {user.phone_no}</Text>
//                 </>
//               )}
//             </div>
//           </div>
//         ),
//         disabled: true,
//       },
//       {
//         key: "edit-avatar",
//         label: (
//           <div
//             onClick={() => fileInputRef.current.click()}
//             style={{
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               paddingLeft: 12,
//               paddingRight: 12,
//             }}
//           >
//             <EditOutlined />
//             Edit Profile Picture
//             <input
//               type="file"
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               style={{ display: "none" }}
//             />
//           </div>
//         ),
//       },
//       { type: "divider" },
//       ...userMenuItems,
//     ],
//   };

//   const createMenu = (
//     <Menu
//       items={[
//         {
//           key: "newProject",
//           icon: <PlusOutlined />,
//           label: "New Project",
//           onClick: () => navigate("/create"),
//         },
//         {
//           key: "viewProjects",
//           icon: <FolderOpenOutlined />,
//           label: "View All Projects",
//           onClick: () => navigate("/projects"),
//         },
//       ]}
//     />
//   );

//   return (
//     <>
//       <Header
//         style={{
//           background: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "0 16px",
//           boxShadow: "0 2px 8px #f0f1f2",
//           flexWrap: "wrap",
//           rowGap: "12px",
//         }}
//       >
//         {/* Logo Section */}
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <img
//             src={logo}
//             alt="Jira Logo"
//             style={{ width: 40, marginRight: 12 }}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src =
//                 "https://upload.wikimedia.org/wikipedia/commons/5/5a/Jira_logo.svg";
//             }}
//           />
//           <h3 style={{ margin: 0 }}>JIRA</h3>
//         </div>

//         {/* Right Side Controls */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "16px",
//             flexWrap: "wrap",
//             justifyContent: "flex-end",
//           }}
//         >
//           {/* Create Dropdown */}
//           <Dropdown overlay={createMenu} trigger={["hover"]}>
//             <Button
//               type="primary"
//               icon={<FolderOpenOutlined />
// }
//               style={{
//                 backgroundColor: "#1890ff",
//                 borderColor: "#1890ff",
//               }}
//             >
//               Create
//             </Button>
//           </Dropdown>

//           {!isMobile ? (
//             <Search
//               placeholder="Search tasks, projects..."
//               allowClear
//               style={{ width: 250 }}
//             />
//           ) : (
//             <Button
//               type="text"
//               icon={<SearchOutlined />}
//               onClick={() => setShowSearchDrawer(true)}
//             />
//           )}

//           <Link to="/notifications" style={{ fontSize: 18 }}>
//             <Badge count={1} size="small" offset={[0, 0]}>
//               <BellOutlined style={{ fontSize: 20 }} />
//             </Badge>
//           </Link>

//           <Dropdown menu={userDropdownContent} trigger={["click"]}>
//             <a onClick={(e) => e.preventDefault()}>
//               <Space>
//                 <Avatar
//                   size="small"
//                   src={profileImage}
//                   icon={!profileImage && <UserOutlined />}
//                 />
//                 <Text>{user?.username || "User"}</Text>
//                 <DownOutlined />
//               </Space>
//             </a>
//           </Dropdown>
//         </div>
//       </Header>

//       {/* Search Drawer for Mobile */}
//       <Drawer
//         title="Search"
//         placement="top"
//         closable
//         onClose={() => setShowSearchDrawer(false)}
//         open={showSearchDrawer}
//         height={100}
//       >
//         <Search placeholder="Search tasks, projects..." allowClear enterButton />
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;


import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  Input,
  Dropdown,
  Space,
  Avatar,
  Typography,
  Badge,
  message,
  Drawer,
  Button,
  Tooltip,
  Menu,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SettingOutlined,
  BellOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/jira.png";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

const Navbar = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "🔔 You have 3 new tasks assigned." },
    { id: 2, message: "📁 Project 'Alpha' has been updated." },
    { id: 3, message: "🕒 Deadline reminder for Task #45." },
  ]);

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (savedImage) setProfileImage(savedImage);
    if (storedUser) setUser(storedUser);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);
      localStorage.setItem("profileImage", base64);
      message.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.get("http://localhost:3000/api/user/auth/logout", {
        withCredentials: true,
      });

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        setLoading(false);
        message.success("Logout successful");
        navigate("/");
      }, 1000);
    } catch (error) {
      setLoading(false);
      message.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <Link
          to="/dashboard/profile"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <UserOutlined />
          Profile
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <Link
          to="/dashboard/settings"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <SettingOutlined />
          Settings
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <div
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "red",
            cursor: "pointer",
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          <LogoutOutlined />
          Logout
        </div>
      ),
    },
  ];

  const userDropdownContent = {
    items: [
      {
        key: "user-info",
        label: (
          <div style={{ padding: "8px 12px", textAlign: "center" }}>
            <Avatar
              size={64}
              src={profileImage}
              icon={!profileImage && <UserOutlined />}
              style={{ marginBottom: 8 }}
            />
            <div>
              <Text strong>{user?.username || "User Name"}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user?.email || "user@example.com"}
              </Text>
              {user?.role && (
                <>
                  <br />
                  <Text style={{ fontSize: 12 }}>Role: {user.role}</Text>
                </>
              )}
              {user?.phone_no && (
                <>
                  <br />
                  <Text style={{ fontSize: 12 }}>Phone: {user.phone_no}</Text>
                </>
              )}
            </div>
          </div>
        ),
        disabled: true,
      },
      {
        key: "edit-avatar",
        label: (
          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 12,
              paddingRight: 12,
            }}
          >
            <EditOutlined />
            Edit Profile Picture
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        ),
      },
      { type: "divider" },
      ...userMenuItems,
    ],
  };

  const createMenu = (
    <Menu
      items={[
        {
          key: "newProject",
          icon: <PlusOutlined />,
          label: "New Project",
          onClick: () => navigate("/dashboard/create"),
        },
        {
          key: "viewProjects",
          icon: <FolderOpenOutlined />,
          label: "View All Projects",
          onClick: () => navigate("/dashboard/projects"),
        },
      ]}
    />
  );

  return (
    <>
      <Header
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
          boxShadow: "0 2px 8px #f0f1f2",
          flexWrap: "wrap",
          rowGap: "12px",
        }}
      >
        {/* Logo Section */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Jira Logo"
            style={{ width: 40, marginRight: 12 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/5/5a/Jira_logo.svg";
            }}
          />
          <h3 style={{ margin: 0 }}>JIRA</h3>
        </div>

        {/* Right Side Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {/* Create Project - Responsive */}
          {isMobile ? (
            <Dropdown
              overlay={createMenu}
              trigger={["hover"]}
              placement="bottomRight"
            >
              <Tooltip title="Create">
                <Button
                  shape="circle"
                  icon={<PlusOutlined />}
                  type="primary"
                  style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
                />
              </Tooltip>
            </Dropdown>
          ) : (
            <Dropdown
              overlay={createMenu}
              trigger={["hover"]}
              placement="bottomRight"
            >
              <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              >
                Create Project
              </Button>
            </Dropdown>
          )}

          {/* Search */}
          {!isMobile ? (
            <Search
              placeholder="Search tasks, projects..."
              allowClear
              style={{ width: 250 }}
            />
          ) : (
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setShowSearchDrawer(true)}
            />
          )}

          {/* Notification */}
          <Button
            type="text"
            icon={
              <Badge count={3} size="small" offset={[0, 0]}>
                <BellOutlined style={{ fontSize: 20 }} />
              </Badge>
            }
            onClick={() => setNotificationOpen(true)}
          />
          <Drawer
            title="Notifications"
            placement="right"
            closable
            onClose={() => setNotificationOpen(false)}
            open={notificationOpen}
            width={350}
            extra={
              notifications.length > 0 && (
                <Button danger onClick={handleClearAll}>
                  Clear All
                </Button>
              )
            }
          >
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                    padding: 10,
                    background: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  <span>{notif.message}</span>
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDeleteNotification(notif.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </Drawer>

          {/* User Dropdown */}
          <Dropdown menu={userDropdownContent} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  size="small"
                  src={profileImage}
                  icon={!profileImage && <UserOutlined />}
                />
                <Text>{user?.username || "User"}</Text>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Header>

      {/* Mobile Search Drawer */}
      <Drawer
        title="Search"
        placement="top"
        closable
        onClose={() => setShowSearchDrawer(false)}
        open={showSearchDrawer}
        height={100}
      >
        <Search
          placeholder="Search tasks, projects..."
          allowClear
          enterButton
        />
      </Drawer>
    </>
  );
};

export default Navbar;