import { getPool } from './_db.js';

import bcrypt from 'bcrypt';
import { validatePassword } from './_passwordPolicy.js';
import { setSecurityHeaders } from './_securityHeaders.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  setSecurityHeaders(res);

  const { email, name, password, consent } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  const { valid, errors } = validatePassword(password);
  if (!valid) {
    return res.status(400).json({
      message: "Mot de passe invalide",
      errors, 
    });
  }

  if (consent !== true) {
    return res.status(400).json({
      message: 'Le consentement est obligatoire',
    });
  }

  try {
    const pool = getPool();

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (email, name, password_hash, role, consent)
       VALUES (?, ?, ?, 'USER', ?)`,
      [email, name, hash, 1]
    );

    return res.status(201).json({ message: 'Inscription réussie' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
