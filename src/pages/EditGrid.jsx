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

  // -------------------------------------------------
  // 1) Récupération de la grille
  // -------------------------------------------------
  async function fetchGrid() {
    const res = await fetch(`/api/grids/view/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Accès refusé");
      return null;
    }

    return res.json();
  }

  // -------------------------------------------------
  // 2) Construire la grille initiale depuis **data**
  // -------------------------------------------------
  function prepareInitialGrid(data) {
    const emptyGrid = Array.from(
      { length: data.grid.size },
      () => Array.from({ length: data.grid.size }, () => "")
    );

    data.cells.forEach(({ x, y, letter }) => {
      emptyGrid[y][x] = letter;
    });

    return emptyGrid;
  }

  // -------------------------------------------------
  // 3) Charger et injecter dans les states
  // -------------------------------------------------
  async function handleLoad() {
    const data = await fetchGrid();
    if (!data) return; // accès refusé

    setTitle(data.grid.title);
    setSize(data.grid.size);

    if (data.words?.length > 0) {
      setWords(data.words.join(", "));
    }

    const grid = prepareInitialGrid(data);
    setPreview(grid);
  }

  // -------------------------------------------------
  // useEffect SUPER SIMPLE → plus d'imbrication !
  // -------------------------------------------------
  useEffect(() => {
    handleLoad();
  }, [id, token]);

  // -------------------------------------------------
  // Génération
  // -------------------------------------------------
  const handleGenerate = () => {
    const list = words
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    const grid = generateGrid(size, list);
    setPreview(grid);
  };

  // -------------------------------------------------
  // Sauvegarde
  // -------------------------------------------------
  const handleSave = async () => {
    if (!preview) {
      alert("Génère une grille avant !");
      return;
    }

    const cells = [];
    preview.forEach((row, y) => {
      row.forEach((letter, x) => {
        cells.push({ x, y, letter });
      });
    });

    const wordList = words
      .split(",")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);

    const res = await fetch(`/api/grids/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        size,
        words: wordList,
        cells,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Grille mise à jour avec succès !");
      globalThis.location.href = "/admin/grids";
    } else {
      alert(data.message);
    }
  };

  // -------------------------------------------------
  // Rendu
  // -------------------------------------------------
  return (
    <div>
      <h2>Modifier la grille {id}</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(Number.parseInt(e.target.value, 10))}
      />

      <textarea value={words} onChange={(e) => setWords(e.target.value)} />

      <button onClick={handleGenerate}>Regénérer</button>

      {preview && (
        <>
          <h3>Aperçu :</h3>

          <div className="game-grid-wrapper" style={{ display: "inline-block", marginBottom: "20px" }}>
            <table className="game-grid">
              <tbody>
                {preview.map((row, i) => (
                  <tr key={`row-${i}`}>
                    {row.map((cell, j) => (
                      <td key={`cell-${i}-${j}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <button className="btn-primary" onClick={handleSave}>
            Enregistrer
          </button>
        </>
      )}
    </div>
  );
}
