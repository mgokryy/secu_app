import jwt from "jsonwebtoken";

export async function verifyAdmin(req, res) {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({ message: "Token manquant" });
      return null;
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      res.status(403).json({ message: "Accès refusé" });
      return null;
    }

    return decoded; // contient id + role
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token invalide" });
    return null;
  }
}
