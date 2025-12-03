import { setSecurityHeaders } from "./_securityHeaders.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  setSecurityHeaders(res);

  res.setHeader(
    "Set-Cookie",
    [
      "jwt=",
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Path=/",
      "Max-Age=0",
    ].join("; ")
  );

  return res.status(200).json({ message: "Déconnecté" });
}


