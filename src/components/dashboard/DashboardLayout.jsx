import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar fixed */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        breakpoint="md"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          zIndex: 101,
          background: "#001529",
        }}
      >
        <Sidebar collapsed={collapsed} />
      </Sider>

      {/* Main Layout with margin for sidebar */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Header
          style={{
            padding: 0,
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <Navbar />
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            overflow: "auto",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
