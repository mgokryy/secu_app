import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListGrids() {
  const [grids, setGrids] = useState([]);
  const token = localStorage.getItem("token");  

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/grids/list", {
        headers: {
          "Authorization": `Bearer ${token}`,  
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
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette grille ?")) return;

    await fetch(`/api/grids/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, 
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
              <div className="action-links">
                <Link to={`/admin/grids/view/${g.id}`} className="action-badge action-view">
                  Voir
                </Link>

                <Link to={`/admin/grids/edit/${g.id}`} className="action-badge action-edit">
                  Éditer
                </Link>


                <button
                  className="action-badge action-delete"
                  onClick={() => handleDelete(g.id)}
                >
                  Supprimer
                </button>

              </div>
            </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
