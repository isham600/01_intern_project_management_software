import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../dashboard/DashboardLayout";
import ForgotPassword from "../Auth/ForgotPassword";
import ResetPassword from "../Auth/ResetPassword";
import PrivateRoute from "./PrivateRoute";

// Pages inside dashboard
const Overview = () => <div>Overview Page</div>;
const KanbanPage = () => <div>Kanban Page</div>;
const ManageProject = () => <div>Manage Project Page</div>;
const Settings = () => <div>Settings Page</div>;
const Profile = () => <div>Profile Page</div>;
const Notifications = () => <div>Notifications Page</div>;
const Create = () => <div>Create Project Page</div>;
const Project = () => <div>View All Projects</div>;

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Nested routes inside Dashboard */}
        <Route index element={<Overview />} /> {/* /dashboard */}
        <Route path="overview" element={<Overview />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="manage-project" element={<ManageProject />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="create" element={<Create />} />
        <Route path="projects" element={<Project />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
