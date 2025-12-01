import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewGrid() {
  const { id } = useParams();
  const [gridData, setGridData] = useState(null);

  const token = localStorage.getItem("token");

  async function loadGrid() {
    const res = await fetch(`/api/grids/view/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    const size = data.grid.size;

    const grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => "")
    );

    data.cells.forEach(({ x, y, letter }) => {
      grid[y][x] = letter;
    });

    setGridData({ info: data.grid, grid });
  }

  useEffect(() => {
    loadGrid();
  }, [id, token]);

  if (!gridData) return <p>Chargement…</p>;

  return (
    <div>
      <h2>Grille : {gridData.info.title}</h2>

      <div className="game-grid-wrapper" style={{ display: "inline-block" }}>
        <table className="game-grid">
          <tbody>
            {gridData.grid.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
