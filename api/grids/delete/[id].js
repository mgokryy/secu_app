import { getPool } from "../../_db.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;

  try {
    const pool = getPool();

    await pool.query("DELETE FROM grids WHERE id = ?", [id]);

    return res.status(200).json({ message: "Grille supprimée" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
