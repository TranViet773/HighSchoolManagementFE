import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles, children }) => {
  return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;