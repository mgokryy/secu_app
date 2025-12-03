import { getPool } from "../_db.js";
import { verifyAdmin } from "../_auth.js";
import { setSecurityHeaders } from "../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  setSecurityHeaders(res);

  const admin = verifyAdmin(req, res);
  if (!admin) return;

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
