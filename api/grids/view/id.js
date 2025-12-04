import { getPool } from "../../_db.js";
import { verifyAuth } from "../../_auth.js";
import { setSecurityHeaders } from "../../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  setSecurityHeaders(res);
  const user = verifyAuth(req, res);
  if (!user) return; 

  const { id } = req.params;


  try {
    const pool = getPool();

    const [[grid]] = await pool.query(
      "SELECT id, title, size, created_at FROM grids WHERE id = ?",
      [id]
    );

    if (!grid) {
      return res.status(404).json({ error: "Grille introuvable" });
    }

    const [cells] = await pool.query(
      "SELECT x, y, letter FROM grid_cells WHERE grid_id = ? ORDER BY y, x",
      [id]
    );

    const [words] = await pool.query(
      "SELECT word FROM grid_words WHERE grid_id = ?",
      [id]
    );

    return res.json({
      grid,
      cells,
      words: words.map((w) => w.word),
    });
  } catch (error) {
    console.error("Erreur view grid:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
