import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateGrid } from "../utils/generateGrid";

export default function EditGrid() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [words, setWords] = useState("");
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/grids/view/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        alert("Accès refusé");
        return;
      }

      const data = await res.json();
      setTitle(data.grid.title);
      setSize(data.grid.size);

      if (data.words && data.words.length > 0) {
        setWords(data.words.join(", "));
      }

      const initialGrid = Array.from({ length: data.grid.size }, () =>
        Array.from({ length: data.grid.size }, () => "")
      );

      data.cells.forEach(({ x, y, letter }) => {
        initialGrid[y][x] = letter; // 🔥 correct
      });

      setPreview(initialGrid);
    }

    load();
  }, [id]);

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
      alert("Génère une grille avant !");
      return;
    }

    const cells = [];
    for (let y = 0; y < preview.length; y++) {
      for (let x = 0; x < preview[y].length; x++) {
        cells.push({ x, y, letter: preview[y][x] });
      }
    }

    const wordList = words
      .split(",")
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length > 0);

    const res = await fetch(`/api/grids/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        size,
        words: wordList,
        cells: cells
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Grille mise à jour avec succès !");
      window.location.href = "/admin/grids";   // 🔥 REDIRECTION
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Modifier la grille {id}</h2>

      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" value={size} onChange={e => setSize(parseInt(e.target.value))} />

      <textarea
        value={words}
        onChange={e => setWords(e.target.value)}
      />

      <button onClick={handleGenerate}>Regénérer</button>

      {preview && (
        <>
          <h3>Aperçu</h3>
          <table border="1">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSave}>Sauvegarder modification</button>
        </>
      )}
    </div>
  );
}
