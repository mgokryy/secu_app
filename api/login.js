import { getPool } from './_db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { setSecurityHeaders } from './_securityHeaders.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  setSecurityHeaders(res);

  const { email, password } = req.body;

  try {
    const pool = getPool();

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    const cookieParts = [
      `jwt=${token}`,
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/",
      
      `Max-Age=${30 * 60}`
    ];
    res.setHeader("Set-Cookie", cookieParts.join("; "));


    return res.status(200).json({
      message: 'Connecté',
      token,
      role: user.role,
      name: user.name
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
