import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
export default function GuestRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    const role = localStorage.getItem("role");
    return <Navigate to={role === "ADMIN" ? "/admin" : "/user"} replace />;
  }

  return children;
}
GuestRoute.propTypes = {
    children: PropTypes.node.isRequired,
};