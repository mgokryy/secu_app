import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateGrid } from "../utils/generateGrid";

export default function EditGrid() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [words, setWords] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/grids/view/${id}`);
      const data = await res.json();

      setTitle(data.grid.title);
      setSize(data.grid.size);
    }

    load();
  }, [id]);

  const handleGenerate = () => {
    const list = words.split(",").map(w => w.trim());
    const grid = generateGrid(size, list);
    setPreview(grid);
  };

  const handleSave = async () => {
    const res = await fetch(`/api/grids/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, size, grid: preview })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>Modifier la grille {id}</h2>

      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input type="number" value={size} onChange={e => setSize(parseInt(e.target.value))} />
      <textarea value={words} onChange={e => setWords(e.target.value)} />

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
