// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
// import { Layout } from "antd";
// import Navbar from "./components/dashboard/navbar";
// import Sidebar from "./components/dashboard/sidebar";
// import DashboardLayout from "./components/dashboard/DashboardLayout";

// // Layout wrapper for dashboard pages

// const Kanban = () => <div>Kanban Page</div>;
// const Overview = () => <div>Overview Page</div>;
// const Settings = () => <div>Settings Page</div>;

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<DashboardLayout />}>
//           <Route path="kanban" element={<Kanban />} />
//           <Route path="overview" element={<Overview />} />
//           <Route path="settings" element={<Settings />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Dashboard Pages
const OverviewPage = () => <div>Overview Page</div>;
const KanbanPage = () => <div>Kanban Page</div>;
const ManageProjectPage = () => <div>Manage Project Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const ProfilePage = () => <div>Profile Page</div>;
const NotificationsPage = () => <div>Notifications Page</div>;
const CreateProjectPage = () => <div>Create Project Page</div>;
const AllProjectsPage = () => <div>View All Projects Page</div>;

// Fallback 404 Page
const NotFoundPage = () => <div>404 - Page Not Found</div>;

const App = () => (
  <Router>
    <Routes>
      {/* Redirect from root to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard with nested routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="manage-project" element={<ManageProjectPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="create" element={<CreateProjectPage />} />
        <Route path="projects" element={<AllProjectsPage />} />
      </Route>

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Router>
);

export default App;
