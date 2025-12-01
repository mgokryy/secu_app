import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "USER" && role !== "ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
}

UserRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

