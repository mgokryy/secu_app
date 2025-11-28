import { getPool } from "../_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, size, grid } = req.body;

  if (!title || !size || !grid) {
    return res.status(400).json({ message: "Paramètres manquants" });
  }
  

  try {
    const pool = getPool();

    const [result] = await pool.query(
      "INSERT INTO grids (title, size, created_by) VALUES (?, ?, ?)",
      [title, size, 1] // TODO : remplacer 1 par l’ID du user connecté
    );

    const grid_id = result.insertId;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        await pool.query(
          "INSERT INTO grid_cells (grid_id, x, y, letter) VALUES (?, ?, ?, ?)",
          [grid_id, x, y, grid[x][y]]
        );
      }
    }

    return res.status(201).json({
      message: "Grille sauvegardée avec succès",
      grid_id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
