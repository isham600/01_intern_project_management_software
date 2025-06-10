import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import GoogleOAuthProvider
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import "./index.css";

// Replace with your actual Google Client ID
const CLIENT_ID =
  "407928983617-52ufnu3ha2qt1cfru84nhjbck4d50hol.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);
