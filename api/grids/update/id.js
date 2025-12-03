import { getPool } from "../../_db.js";
import { verifyAdmin } from "../../_auth.js";
import { setSecurityHeaders } from "../../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  setSecurityHeaders(res);

  const admin = verifyAdmin(req, res); 
  if (!admin) return;

  const { id } = req.params;
  const { title, size, words, cells } = req.body;

  if (!title || !size || !Array.isArray(words) || !Array.isArray(cells)) {
    return res.status(400).json({ error: "Données manquantes ou invalides" });
  }
  const n = Number(size);
  if (!Number.isInteger(n) || n < 5 || n > 20) {
    return res.status(400).json({ error: "Taille de grille invalide" });
  }

  if (cells.length !== n * n) {
    return res.status(400).json({ error: "Nombre de cellules incohérent" });
  }


  try {
    const pool = getPool();

    await pool.query(
      "UPDATE grids SET title = ?, size = ? WHERE id = ?",
      [title, size, id]
    );

    await pool.query("DELETE FROM grid_cells WHERE grid_id = ?", [id]);
    await pool.query("DELETE FROM grid_words WHERE grid_id = ?", [id]);

    const cellValues = cells.map(c => [id, c.x, c.y, c.letter]);

    await pool.query(
      "INSERT INTO grid_cells (grid_id, x, y, letter) VALUES ?",
      [cellValues]
    );

    const wordValues = words.map(w => [id, w.toUpperCase()]);

    await pool.query(
      "INSERT INTO grid_words (grid_id, word) VALUES ?",
      [wordValues]
    );

    return res.status(200).json({ message: "Grille mise à jour" });

  } catch (err) {
    console.error("ERREUR UPDATE GRID:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
