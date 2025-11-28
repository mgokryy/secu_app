export default function UserDashboard() {
  const name = localStorage.getItem("name");

  return (
    <div>
      <h2>Bienvenue, {name}</h2>
      <p>Tu es connecté en tant qu’utilisateur.</p>
    </div>
  );
}
