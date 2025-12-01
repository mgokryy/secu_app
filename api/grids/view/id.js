import { getPool } from "../../_db.js";
import { verifyAuth } from "../../_auth.js";

export default function handler(req, res) {
  return verifyAuth(req, res, async () => {
    const { id } = req.params;

    try {
      const pool = getPool();

      // Récupérer la grille
      const [[grid]] = await pool.query(
        "SELECT id, title, size, created_at FROM grids WHERE id = ?",
        [id]
      );

      if (!grid) {
        return res.status(404).json({ error: "Grille introuvable" });
      }

      // Récupérer les cellules
      const [cells] = await pool.query(
        "SELECT x, y, letter FROM grid_cells WHERE grid_id = ? ORDER BY y, x",
        [id]
      );

      // Récupérer les mots
      const [words] = await pool.query(
        "SELECT word FROM grid_words WHERE grid_id = ?",
        [id]
      );

      return res.json({
        grid,                     // 👈 PlayGrid attend CET OBJET
        cells,
        words: words.map(w => w.word)
      });

    } catch (error) {
      console.error("Erreur view grid:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });
}
