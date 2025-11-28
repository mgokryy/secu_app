import { useState } from "react";
import { generateGrid } from "../utils/generateGrid";

export default function CreateGrid() {
  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [words, setWords] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleGenerate = () => {
    const list = words.split(",").map(w => w.trim());
    const grid = generateGrid(size, list);
    setPreview(grid);
    };
    const handleSave = async () => {
    if (!preview) {
        alert("Génère une grille avant de sauvegarder !");
        return;
    }

    const res = await fetch("/api/grids/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        title,
        size,
        grid: preview
        })
    });
    

    const data = await res.json();

    if (res.ok) {
        alert("Grille créée avec succès !");
        window.location.href = "/admin/grids"; // 🔥 REDIRECTION
    } else {
        alert(data.message);
    }
    };




  return (
    <div>
      <h2>Créer une grille</h2>

      <input
        type="text"
        placeholder="Titre de la grille"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        type="number"
        value={size}
        onChange={e => setSize(parseInt(e.target.value))}
      />

      <textarea
        placeholder="Mots séparés par des virgules"
        value={words}
        onChange={e => setWords(e.target.value)}
      />

      <button onClick={handleGenerate}>Générer la grille</button>

      {preview && (
        <>
          <h3>Aperçu :</h3>
          <table border="1">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "5px" }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSave}>Enregistrer</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
