// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Leaderboard() {
  const { id } = useParams(); // id = grid_id
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/scores/leaderboard/${id}`);
      const data = await res.json();
      setScores(data);
    }
    load();
  }, [id]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Classement – Grille {id}</h2>

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Joueur</th>
            <th>Score</th>
            <th>Durée (s)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, index) => (
            <tr key={s.id}>
              <td>{index + 1}</td>
              <td>{s.username}</td>
              <td>{s.score}</td>
              <td>{s.duration_seconds}</td>
              <td>{new Date(s.played_at).toLocaleString()}</td>
            </tr>
          ))}
          {scores.length === 0 && (
            <tr>
              <td colSpan="5">Aucun score pour cette grille pour l’instant.</td>
            </tr>
          )}
        </tbody>
      </table>

      <p style={{ marginTop: "15px" }}>
        <Link to="/user/grids">← Retour aux grilles</Link>
      </p>
    </div>
  );
}
