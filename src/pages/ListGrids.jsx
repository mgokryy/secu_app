import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListGrids() {
  const [grids, setGrids] = useState([]);
  const token = localStorage.getItem("token");  // 🔥 récupère le token

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/grids/list", {
        headers: {
          "Authorization": `Bearer ${token}`,  // 🔥 Obligatoire pour admin
        }
      });

      if (res.status === 401 || res.status === 403) {
        alert("Accès refusé");
        return;
      }

      const data = await res.json();
      setGrids(data);
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette grille ?")) return;

    await fetch(`/api/grids/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // 🔥 aussi obligatoire
      }
    });

    setGrids((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div>
      <h2>Liste des grilles</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Taille</th>
            <th>Créée le</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {grids.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.title}</td>
              <td>{g.size} x {g.size}</td>
              <td>{new Date(g.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/admin/grids/view/${g.id}`}>Voir</Link> |  
                <Link to={`/admin/grids/edit/${g.id}`}>Éditer</Link> |  
                <span
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => handleDelete(g.id)}
                >
                  Supprimer
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
