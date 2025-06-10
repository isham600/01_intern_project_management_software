import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const hasShownMessage = useRef(false);

  useEffect(() => {
    if (!user && !hasShownMessage.current) {
      message.warning("Please login first");
      hasShownMessage.current = true;
    }
  }, [user]);

  return user ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;
