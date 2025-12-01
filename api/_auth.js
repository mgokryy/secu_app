import jwt from "jsonwebtoken";

export function verifyAuth(req, res) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token manquant" });
      return null;
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 

    return decoded;
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ message: "Token invalide" });
    return null;
  }
}
