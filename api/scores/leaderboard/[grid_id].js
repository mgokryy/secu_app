// api/scores/leaderboard/[grid_id].js
import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { grid_id } = req.query;

  if (!grid_id) {
    return res.status(400).json({ message: "grid_id manquant" });
  }

  try {
    const pool = getPool();

    const [rows] = await pool.query(
      `SELECT 
          s.id, 
          s.score, 
          s.duration_seconds, 
          s.played_at,
          u.name AS username      -- <-- ICI on utilise u.name
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.grid_id = ?
       ORDER BY s.score DESC, s.duration_seconds ASC
       LIMIT 20`,
      [grid_id]
    );

    return res.json(rows);

  } catch (err) {
    console.error("ERREUR SQL LEADERBOARD :", err);
    return res.status(500).json({
      message: "Erreur serveur leaderboard",
      error: err.message
    });
  }
}
