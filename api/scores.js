// api/scores.js
import { getPool } from "./_db.js";
import { verifyAuth } from "./_auth.js";

export default async function handler(req, res) {
  // On n'accepte que POST
  if (req.method !== "POST") return res.status(405).end();

  // Utilisateur connecté (n'importe quel user)
  const user = verifyAuth(req, res);
  if (!user) return;

  const { grid_id, score, duration_seconds } = req.body;

  if (!grid_id || typeof score !== "number" || typeof duration_seconds !== "number") {
    return res.status(400).json({ message: "Données manquantes ou invalides" });
  }

  try {
    const pool = getPool();

    await pool.query(
      `INSERT INTO scores (user_id, grid_id, score, duration_seconds, played_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [user.id, grid_id, score, duration_seconds]
    );

    return res.status(201).json({ message: "Score enregistré" });
  } catch (err) {
    console.error("ERREUR INSERT SCORE :", err);
    return res.status(500).json({ message: "Erreur serveur score" });
  }
}
