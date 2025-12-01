import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateGrid from "./pages/CreateGrid";
import AdminRoute from "./components/AdminRoute";
import GuestRoute from "./components/GuestRoute";
import UserRoute from "./components/UserRoute"; 
import ListGrids from "./pages/ListGrids";
import ViewGrid from "./pages/ViewGrid";
import EditGrid from "./pages/EditGrid";
import UserGrids from "./pages/UserGrids";
import PlayGrid from "./pages/PlayGrid";
import Leaderboard from "./pages/Leaderboard.jsx";


export default function App() {
  return (
    <div className="app-container">

      <nav>
        {/* PAS CONNECTÉ */}
        {!localStorage.getItem("token") && (
          <>
            <Link to="/register">Inscription</Link> | 
            <Link to="/login">Connexion</Link>
          </>
        )}

        {/* CONNECTÉ NON ADMIN (USER) */}
        {localStorage.getItem("token") && localStorage.getItem("role") === "USER" && (
          <>
            <Link to="/grids" style={{ marginRight: "10px" }}>Grilles</Link>
          </>
        )}

        {/* ADMIN */}
        {localStorage.getItem("role") === "ADMIN" && (
          <>
            <Link to="/admin" style={{ marginRight: "10px" }}>Accueil</Link>
            <Link to="/admin/grids" style={{ marginRight: "10px" }}>Grilles</Link>
            <Link to="/grids" style={{ marginRight: "10px" }}>Grilles (jouer)</Link>
          </>
        )}

        {/* DÉCONNEXION */}
        {localStorage.getItem("token") && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              window.location.href = "/login";
            }}
            style={{
              marginLeft: "20px",
              padding: "5px 10px",
              background: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Déconnexion
          </button>
        )}
      </nav>

      <Routes>
        {/* GUEST */}
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

        {/* USER */}
        <Route path="/user" element={<UserDashboard />} />

        <Route 
          path="/grids" 
          element={
            <UserRoute>
              <UserGrids />
            </UserRoute>
          } 
        />

        <Route 
          path="/play/:id" 
          element={
            <UserRoute>
              <PlayGrid />
            </UserRoute>
          }
        />

        
        <Route
          path="/leaderboard/:id"
          element={
            <UserRoute>
              <Leaderboard />
            </UserRoute>
          }
        />


        {/* ADMIN */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="/admin/grids/create" element={<AdminRoute><CreateGrid /></AdminRoute>} />
        <Route path="/admin/grids" element={<AdminRoute><ListGrids /></AdminRoute>} />
        <Route path="/admin/grids/view/:id" element={<AdminRoute><ViewGrid /></AdminRoute>} />
        <Route path="/admin/grids/edit/:id" element={<AdminRoute><EditGrid /></AdminRoute>} />

      </Routes>

    </div>
  );
}
