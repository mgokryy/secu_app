import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;

  try {
    const pool = getPool();

    const [[grid]] = await pool.query(
      "SELECT * FROM grids WHERE id = ?",
      [id]
    );

    if (!grid) {
      return res.status(404).json({ message: "Grille introuvable" });
    }

    const [cells] = await pool.query(
      "SELECT x, y, letter FROM grid_cells WHERE grid_id = ?",
      [id]
    );

    return res.status(200).json({
      grid,
      cells
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
