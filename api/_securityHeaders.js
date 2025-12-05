export function setSecurityHeaders(res) {
  // Empêche le navigateur d'interpréter un fichier avec un type MIME différent (mitige les attaques MIME sniffing)
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Interdit d'afficher le site dans une iframe pour éviter le clickjacking
  res.setHeader("X-Frame-Options", "DENY");
}
