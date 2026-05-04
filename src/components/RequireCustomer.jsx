import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireCustomer({ children }) {
  const { isCustomer } = useAuth();
  const loc = useLocation();

  if (!isCustomer) {
    return <Navigate to="/login" replace state={{ from: `${loc.pathname}${loc.search}` }} />;
  }
  return children;
}
