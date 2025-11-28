import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const name = localStorage.getItem("name");

  return (
    <div>
      <h2>Bienvenue, admin {name}</h2>

      <Link to="/admin/grids">
        <button>Voir toutes les grilles</button>
      </Link>
      <br /><br />

      <Link to="/admin/grids/create">
        <button>Créer une nouvelle grille</button>
      </Link>
    </div>
  );
}
