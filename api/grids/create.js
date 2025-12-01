import { getPool } from "../_db.js";
import { verifyAdmin } from "../_auth.js";
import { setSecurityHeaders } from "../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  setSecurityHeaders(res);

  // Vérification ADMIN
  const admin = await verifyAdmin(req, res);
  if (!admin) return;

  const { title, size, words, cells } = req.body;

  if (!title || !size || !Array.isArray(words) || !Array.isArray(cells)) {
    return res.status(400).json({ message: "Données manquantes ou invalides" });
  }

  try {
    const pool = getPool();

    // 🔹 Insert grille
    const [result] = await pool.query(
      `INSERT INTO grids (title, size, created_by) VALUES (?, ?, ?)`,
      [title, size, admin.id]
    );

    const gridId = result.insertId;

    // 🔹 Insert cellules
    const cellValues = cells.map(c => [gridId, c.x, c.y, c.letter]);

    await pool.query(
      `INSERT INTO grid_cells (grid_id, x, y, letter) VALUES ?`,
      [cellValues]
    );

    // 🔹 Insert mots
    const wordValues = words.map(w => [gridId, w.toUpperCase()]);

    await pool.query(
      `INSERT INTO grid_words (grid_id, word) VALUES ?`,
      [wordValues]
    );

    return res.status(201).json({
      message: "Grille créée avec succès",
      id: gridId
    });

  } catch (err) {
    console.error("ERREUR CREATE GRID :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}