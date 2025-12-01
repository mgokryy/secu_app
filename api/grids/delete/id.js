import { getPool } from "../../_db.js";
import { verifyAdmin } from "../../_auth.js";
import { setSecurityHeaders } from "../../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end();

  setSecurityHeaders(res);

  const admin = verifyAdmin(req, res);
  if (!admin) return;

  const { id } = req.params;

  try {
    const pool = getPool();

    await pool.query("DELETE FROM grid_cells WHERE grid_id = ?", [id]);
    await pool.query("DELETE FROM grid_words WHERE grid_id = ?", [id]);
    await pool.query("DELETE FROM grids WHERE id = ?", [id]);

    return res.status(200).json({ message: "Grille supprimée" });

  } catch (err) {
    console.error("ERREUR DELETE GRID:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
