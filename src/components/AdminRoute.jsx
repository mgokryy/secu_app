import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
export default function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
