import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }) {
  const token = localStorage.getItem("token");

  // S'il y a un token, l'utilisateur est déjà connecté
  if (token) {
    const role = localStorage.getItem("role");
    return <Navigate to={role === "ADMIN" ? "/admin" : "/user"} replace />;
  }

  return children;
}
