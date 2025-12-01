export function setSecurityHeaders(res) {
  // Headers de sécurité basiques demandés dans le cahier des charges
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
}


