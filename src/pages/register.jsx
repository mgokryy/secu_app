import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, consent })
      });

      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Erreur réseau");
    }
  }

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          J'accepte les conditions
        </label>

        <button type="submit">S'inscrire</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}