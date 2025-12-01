import { useState } from "react";
import { generateGrid } from "../utils/generateGrid";

export default function CreateGrid() {
  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [words, setWords] = useState("");
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const handleGenerate = () => {
    const list = words
      .split(",")
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const grid = generateGrid(size, list);
    setPreview(grid);
  };

  const handleSave = async () => {
    if (!preview) {
      alert("Génère une grille avant de sauvegarder !");
      return;
    }

    // 🔥 Convertir le tableau 2D → liste de cellules
    const cells = [];
    for (let y = 0; y < preview.length; y++) {
      for (let x = 0; x < preview[y].length; x++) {
        cells.push({
          x,
          y,
          letter: preview[y][x]
        });
      }
    }

    // 🔥 Convertir words string → tableau
    const wordList = words
      .split(",")
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0);

    const res = await fetch("/api/grids/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        size,
        words: wordList,
        cells: cells  // 🔥 très important !
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Grille créée avec succès !");
      globalThis.location.href = "/admin/grids";
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
        onChange={e => setSize(Number(e.target.value))}
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
                <tr key={`row-${i}`}>

                  {row.map((cell, j) => (
                    <td key={`cell-${i}-${j}`} style={{ padding: "5px" }}>{cell}</td>
                    
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSave}>Enregistrer</button>
        </>
      )}
    </div>
  );
}
