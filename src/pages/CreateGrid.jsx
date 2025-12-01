import { useState } from "react";
import { generateGrid } from "../utils/generateGrid";

export default function CreateGrid() {
  const [title, setTitle] = useState("");
  const [size, setSize] = useState(10);
  const [words, setWords] = useState("");
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  // -------------------------------------------------
  // GÉNÉRER LA GRILLE
  // -------------------------------------------------
  const handleGenerate = () => {
    const list = words
      .split(",")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length > 0);

    if (list.length === 0) {
      alert("Ajoute au moins un mot !");
      return;
    }

    const grid = generateGrid(size, list);
    setPreview(grid);
  };

  // -------------------------------------------------
  // ENVOYER AU SERVEUR
  // -------------------------------------------------
  const handleSave = async () => {
    if (!preview) {
      alert("Génère une grille d'abord !");
      return;
    }

    const cells = [];
    preview.forEach((row, y) => {
      row.forEach((letter, x) => {
        cells.push({ x, y, letter });
      });
    });

    const res = await fetch("/api/grids/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        size,
        words: words
          .split(",")
          .map((w) => w.trim().toUpperCase())
          .filter((w) => w.length > 0),
        cells,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Grille créée !");
      window.location.href = "/admin/grids";
    } else {
      alert(data.message || "Erreur serveur");
    }
  };

  // -------------------------------------------------
  // RENDU
  // -------------------------------------------------
  return (
    <div>
      <h2>Créer une grille</h2>

      <input
        placeholder="Titre de la grille"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />

      <textarea
        placeholder="Mots séparés par des virgules"
        value={words}
        onChange={(e) => setWords(e.target.value)}
      />

      <button onClick={handleGenerate}>Générer la grille</button>

      {preview && (
        <>
          <h3>Aperçu :</h3>

          {/* --------- STYLE PROPRE --------- */}
          <div
            style={{
              padding: "10px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              display: "inline-block",
              background: "#f9f9ff",
              marginBottom: "20px",
            }}
          >
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.join("")}>
                    {row.map((cell, index) => (
                      <td
                        key={row.join("") + "-" + index}
                        style={{
                          border: "1px solid #888",
                          width: "34px",
                          height: "34px",
                          textAlign: "center",
                          fontSize: "20px",
                          padding: 0,
                          userSelect: "none",
                          backgroundColor: "white",
                          fontWeight: "600",
                        }}
                      >
                        {cell}
                      </td>
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
