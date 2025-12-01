import { getPool } from "../../_db.js";
import { setSecurityHeaders } from "../../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  setSecurityHeaders(res);

  const { grid_id } = req.params;

  try {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT 
        u.name,
        s.user_id,
        MAX(s.score) AS best_score,
        MIN(s.duration_seconds) AS best_duration,
        MIN(s.played_at) AS first_time
      FROM scores s
      JOIN users u ON u.id = s.user_id
      WHERE s.grid_id = ?
      GROUP BY s.user_id
      ORDER BY best_score DESC, best_duration ASC
      `,
      [grid_id]
    );

    return res.status(200).json(rows);

  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    return res.status(500).json({ message: "Erreur serveur leaderboard" });
  }
}
