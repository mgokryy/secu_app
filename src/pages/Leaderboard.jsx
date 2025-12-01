import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Leaderboard() {
  const { id } = useParams();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/scores/leaderboard/${id}`);

        if (!res.ok) {
          console.error("Erreur API leaderboard", await res.text());
          setLoading(false);
          return;
        }

        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Erreur réseau", err);
      }
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Classement – Grille {id}
      </h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Joueur</th>
              <th>Meilleur Score</th>
              <th>Durée (s)</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "18px" }}>
                  Aucun score pour cette grille pour l’instant.
                </td>
              </tr>
            ) : (
              scores.map((row, index) => (
                <tr key={`score-${row.user_id}`}>

                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td><strong>{row.best_score}</strong></td>
                  <td>{row.best_duration}</td>
                  <td>{new Date(row.first_time).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link
          to="/grids"
          className="btn-secondary"
          style={{ padding: "10px 16px", display: "inline-block" }}
        >
          ← Retour
        </Link>
      </div>
    </div>
  );
}
