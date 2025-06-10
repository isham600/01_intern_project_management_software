import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  ProjectOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import logo from "../../assets/jira.png"; // Replace with correct path

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.split("/")[2] || "overview";

  const menuItems = [
    {
      label: "Overview",
      key: "overview",
      icon: <AppstoreOutlined style={{ fontSize: "18px" }} />,
      onClick: () => navigate("/dashboard/overview"),
    },
    {
      label: "Kanban",
      key: "kanban",
      icon: <ProjectOutlined style={{ fontSize: "18px" }} />,
      onClick: () => navigate("/dashboard/kanban"),
    },
    {
      label: "Manage Project",
      key: "manage-project",
      icon: <FolderOpenOutlined style={{ fontSize: "18px" }} />,
      onClick: () => navigate("/dashboard/manage-project"),
    },
    {
      label: "Settings",
      key: "settings",
      icon: <SettingOutlined style={{ fontSize: "18px" }} />,
      onClick: () => navigate("/dashboard/settings"),
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo section */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? 0 : "0 16px",
          backgroundColor: "#001529",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={() => navigate("/dashboard/overview")}
        className="logo-hover"
      >
        <img
          src={logo}
          alt="JIRA Logo"
          style={{
            height: 32,
            transition: "transform 0.3s ease",
            filter: "grayscale(30%)",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://upload.wikimedia.org/wikipedia/commons/5/5a/Jira_logo.svg";
          }}
        />
        {!collapsed && (
          <span
            style={{
              color: "#fff",
              marginLeft: 12,
              fontWeight: "bold",
              fontSize: 16,
              transition: "opacity 0.3s",
            }}
          >
            JIRA
          </span>
        )}
      </div>

      {/* Menu section */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default Sidebar;