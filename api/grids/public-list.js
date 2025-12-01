import { verifyAuth } from "../_auth.js";
import { getPool } from "../_db.js";
import { setSecurityHeaders } from "../_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  setSecurityHeaders(res);

  const user = verifyAuth(req, res);
  if (!user) return;

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, title, size, created_at FROM grids ORDER BY created_at DESC"
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
