import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();
  const loc = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
