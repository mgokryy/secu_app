import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const { id } = req.query;
  const { title, size, words, cells } = req.body;

  if (!title || !size || !Array.isArray(words) || !Array.isArray(cells)) {
    return res.status(400).json({ message: "Données manquantes ou invalides" });
  }

  try {
    const pool = getPool();

    // update grille
    await pool.query(
      "UPDATE grids SET title = ?, size = ? WHERE id = ?",
      [title, size, id]
    );

    // delete old cells
    await pool.query("DELETE FROM grid_cells WHERE grid_id = ?", [id]);

    // delete old words
    await pool.query("DELETE FROM grid_words WHERE grid_id = ?", [id]);

    // recreate cells
    const cellValues = cells.map(c => [
      id,
      c.x,
      c.y,
      c.letter
    ]);

    await pool.query(
      "INSERT INTO grid_cells (grid_id, x, y, letter) VALUES ?",
      [cellValues]
    );

    // recreate words
    const wordValues = words.map(w => [id, w]);

    await pool.query(
      "INSERT INTO grid_words (grid_id, word) VALUES ?",
      [wordValues]
    );

    return res.status(200).json({ message: "Grille mise à jour" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
