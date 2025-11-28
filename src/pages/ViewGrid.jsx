import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewGrid() {
  const { id } = useParams();
  const [gridData, setGridData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/grids/view/${id}`);
      const data = await res.json();

      const size = data.grid.size;

      // créer une grille vide
      const grid = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => "")
      );

      // remplir la grille avec les lettres
      data.cells.forEach(({ x, y, letter }) => {
        grid[x][y] = letter;
      });

      setGridData({ info: data.grid, grid });
    }

    load();
  }, [id]);

  if (!gridData) return <p>Chargement…</p>;

  return (
    <div>
      <h2>Grille : {gridData.info.title}</h2>

      <table border="1">
        <tbody>
          {gridData.grid.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "5px" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
