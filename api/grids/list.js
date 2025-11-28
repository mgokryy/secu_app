import { getPool } from "../_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT id, title, size, created_at FROM grids ORDER BY id DESC"
    );

    return res.status(200).json(rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
