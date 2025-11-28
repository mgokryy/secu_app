import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const { id } = req.query;
  const { title, size, grid } = req.body;

  try {
    const pool = getPool();

    // update grille
    await pool.query(
      "UPDATE grids SET title = ?, size = ? WHERE id = ?",
      [title, size, id]
    );

    // delete old cells
    await pool.query("DELETE FROM grid_cells WHERE grid_id = ?", [id]);

    // recreate cells
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        await pool.query(
          "INSERT INTO grid_cells (grid_id, x, y, letter) VALUES (?, ?, ?, ?)",
          [id, x, y, grid[x][y]]
        );
      }
    }

    return res.status(200).json({ message: "Grille mise à jour" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
