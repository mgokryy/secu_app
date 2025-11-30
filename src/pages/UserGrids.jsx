import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserGrids() {
  const [grids, setGrids] = useState([]);

 
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/grids/public-list", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) {
        console.error("Erreur API", res.status);
        return;
      }

      const data = await res.json();
      setGrids(data);
    }
    load();
  }, []);


  return (
    <div>
      <h2>Grilles disponibles</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Taille</th>
            <th>Date</th>
            <th>Jouer</th>
          </tr>
        </thead>

        <tbody>
          {grids.map((g) => (
            <tr key={g.id}>
              <td>{g.title}</td>
              <td>{g.size} x {g.size}</td>
              <td>{new Date(g.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/play/${g.id}`}>Jouer</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
 