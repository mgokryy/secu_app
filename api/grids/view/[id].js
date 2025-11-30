import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const { id } = req.query;

  try {
    const pool = getPool();

    // Charger la grille
    const [[grid]] = await pool.query(
      "SELECT * FROM grids WHERE id = ?",
      [id]
    );

    if (!grid) {
      return res.status(404).json({ message: "Grille introuvable" });
    }

    // Charger cellules
    const [cells] = await pool.query(
      "SELECT x, y, letter FROM grid_cells WHERE grid_id = ? ORDER BY y, x",
      [id]
    );

    // Charger mots
    const [words] = await pool.query(
      "SELECT word FROM grid_words WHERE grid_id = ?",
      [id]
    );

    return res.status(200).json({
      grid,
      cells,
      words: words.map(w => w.word)
    });

  } catch (err) {
    console.error("ERREUR VIEW GRID:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}