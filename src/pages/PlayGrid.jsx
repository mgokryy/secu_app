// src/pages/PlayGrid.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const COLORS = [
  "#ffb3ba",
  "#baffc9",
  "#bae1ff",
  "#ffffba",
  "#ffdfba",
  "#e2baff",
];

export default function PlayGrid() {
  const { id } = useParams();

  const [grid, setGrid] = useState(null);
  const [info, setInfo] = useState(null);
  const [words, setWords] = useState([]);

  const [foundWords, setFoundWords] = useState([]);
  const [foundCells, setFoundCells] = useState([]);

  const [selecting, setSelecting] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);
  const [direction, setDirection] = useState(null);

  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false);
  const [score, setScore] = useState(null);

  const token = localStorage.getItem("token");

  // -----------------------
  // Chargement grille
  // -----------------------
  async function loadGrid() {
    const res = await fetch(`/api/grids/view/${id}`);
    const data = await res.json();

    const size = data.grid.size;

    const matrix = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );

    data.cells.forEach((c) => {
      matrix[c.y][c.x] = c.letter;
    });

    setGrid(matrix);
    setInfo(data.grid);
    setWords(data.words || []);

    setStartTime(Date.now());
    setElapsed(0);
    setHasFinished(false);
    setHasSavedScore(false);
    setScore(null);
  }

  useEffect(() => {
    loadGrid();
  }, [id]);

  // -----------------------
  // Timer
  // -----------------------
  useEffect(() => {
    if (!startTime || hasFinished) return;

    const intervalId = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, hasFinished]);

  if (!grid) return <p>Chargement…</p>;

  const computeScore = (seconds) => Math.max(0, 1000 - seconds);

  // -----------------------
  // Score
  // -----------------------
  const saveScore = async (durationSeconds, scoreValue) => {
    if (hasSavedScore || !info) return;

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grid_id: info.id,
          score: scoreValue,
          duration_seconds: durationSeconds,
        }),
      });

      
      if (!res.ok) {
        console.error("Erreur enregistrement score", await res.text());
        return;
      }

      setHasSavedScore(true);
      console.log("Score enregistré");

    } catch (err) {
      console.error("Erreur réseau score", err);
    }
  };

  // -----------------------
  // Helpers sélection
  // -----------------------
  const getDxDy = (last, x, y) => ({
    dx: Math.sign(x - last.x),
    dy: Math.sign(y - last.y),
  });

  const isSameCell = (last, x, y) => last.x === x && last.y === y;

  const isDiagonalOrStraight = (dx, dy) =>
    Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

  const isNextCell = (last, x, y, direction) =>
    x === last.x + direction.dx && y === last.y + direction.dy;

  // -----------------------
  // Sélection
  // -----------------------
  const startSelection = (y, x) => {
    if (hasFinished) return;
    setSelecting(true);
    setSelectedCells([{ x, y }]);
    setDirection(null);
  };

  const continueSelection = (y, x) => {
    if (!selecting || hasFinished) return;

    setSelectedCells((prev) => {
      if (prev.length === 0) return [{ x, y }];

      const last = prev[prev.length - 1];
      if (isSameCell(last, x, y)) return prev;

      const { dx, dy } = getDxDy(last, x, y);
      if (dx === 0 && dy === 0) return prev;

      if (!direction) {
        if (!isDiagonalOrStraight(dx, dy)) return prev;

        const newDir = { dx, dy };
        setDirection(newDir);

        return isNextCell(last, x, y, newDir)
          ? [...prev, { x, y }]
          : prev;
      }

      if (dx !== direction.dx || dy !== direction.dy) return prev;

      if (isNextCell(last, x, y, direction)) {
        if (prev.some((c) => c.x === x && c.y === y)) return prev;
        return [...prev, { x, y }];
      }

      return prev;
    });
  };

  const endSelection = () => {
    if (!selecting || selectedCells.length === 0) {
      setSelecting(false);
      setSelectedCells([]);
      setDirection(null);
      return;
    }

    const letters = selectedCells.map((c) => grid[c.y][c.x]).join("");
    const reversed = [...letters].reverse().join("");

    const upperWords = new Set(words.map((w) => w.toUpperCase()));

    let foundWord = null;
    if (upperWords.has(letters)) foundWord = letters;
    if (upperWords.has(reversed)) foundWord = reversed;

    if (foundWord && !foundWords.includes(foundWord)) {
      const color = COLORS[foundWords.length % COLORS.length];

      setFoundWords((prev) => [...prev, foundWord]);
      setFoundCells((prev) => [
        ...prev,
        ...selectedCells.map((c) => ({ ...c, color })),
      ]);

      const newFoundCount = foundWords.length + 1;
      if (newFoundCount === words.length && words.length > 0) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(duration);
        setHasFinished(true);

        const sc = computeScore(duration);
        setScore(sc);
        saveScore(duration, sc);
      }
    }

    setSelecting(false);
    setSelectedCells([]);
    setDirection(null);
  };

  // -----------------------
  // Touch mobile
  // -----------------------
  const handleTouch = (e, callback) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;

    const x = Number.parseInt(el.dataset.x, 10);
    const y = Number.parseInt(el.dataset.y, 10);

    if (!Number.isNaN(x) && !Number.isNaN(y)) callback(y, x);
  };

  const handleTouchStart = (e) => handleTouch(e, startSelection);
  const handleTouchMove = (e) => handleTouch(e, continueSelection);
  const handleTouchEnd = () => endSelection();

  // -----------------------
  // UI helpers
  // -----------------------
  const getFoundColor = (x, y) => {
    const cell = foundCells.find((c) => c.x === x && c.y === y);
    return cell ? cell.color : null;
  };

  const isSelected = (x, y) =>
    selectedCells.some((c) => c.x === x && c.y === y);

  // -----------------------
  // Rendu
  // -----------------------
  return (
    <section
      role="button"
      aria-label="Zone de jeu"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && endSelection()}
      onMouseUp={endSelection}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        touchAction: "none",
      }}
    >

      <h2 style={{ marginBottom: "10px" }}>Grille : {info?.title}</h2>

      <div style={{ marginBottom: "10px" }}>
        <strong>Temps :</strong> {elapsed}s{" "}
        {score !== null && (
          <>
            {" — "}
            <strong>Score :</strong> {score}
          </>
        )}
      </div>

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
            {grid.map((row, y) => (
              <tr key={`row-${y}`}>
                {row.map((letter, x) => {
                  const foundColor = getFoundColor(x, y);
                  const selected = isSelected(x, y);

                  const bgColor = selected
                    ? "#a4c8ff"
                    : foundColor || "white";

                  return (
                    <td
                      key={`cell-${y}-${x}`}
                      data-x={x}
                      data-y={y}
                      onMouseDown={() => startSelection(y, x)}
                      onMouseEnter={() => continueSelection(y, x)}
                      style={{
                        border: "1px solid #888",
                        width: "34px",
                        height: "34px",
                        textAlign: "center",
                        fontSize: "20px",
                        userSelect: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        backgroundColor: bgColor,
                        fontWeight: "600",
                      }}
                    >
                      {letter}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <table style={{ borderCollapse: "collapse" }}>
          <tbody>
            {grid.map((row) => (
              <tr key={row.join("")}>
                {row.map((letter, x) => {
                  const y = row.indexOf(letter); 
                  return (
                    <td
                      key={`${letter}-${x}`}
                      data-x={x}
                      data-y={grid.indexOf(row)}
                      onMouseDown={() => startSelection(grid.indexOf(row), x)}
                      onMouseEnter={() => continueSelection(grid.indexOf(row), x)}
                      style={{
                        border: "1px solid #888",
                        width: "34px",
                        height: "34px",
                        textAlign: "center",
                        fontSize: "20px",
                        userSelect: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        backgroundColor: bgColor,
                        fontWeight: "600",
                      }}
                    >
                      {letter}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div style={{ marginTop: "25px" }}>
        <h3>Mots à trouver :</h3>

        <div className="word-badges-container">
          {words.map((w) => (
            <div
              key={w}
              className={
                foundWords.includes(w.toUpperCase())
                  ? "word-badge found"
                  : "word-badge"
              }
            >
              {w}
            </div>
          ))}
        </div>
      </div>

      {hasFinished && (
        <div style={{ marginTop: "15px" }}>
          <h3 style={{ color: "green" }}>🎉 Bravo ! Tous les mots trouvés !</h3>
          {info && (
            <p>
              <Link to={`/leaderboard/${info.id}`} className="nav-btn">
                Voir le classement →
              </Link>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
