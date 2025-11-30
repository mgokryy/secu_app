import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewGrid() {
  const { id } = useParams();
  const [gridData, setGridData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/grids/view/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      const size = data.grid.size;

      const grid = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => "")
      );

      data.cells.forEach(({ x, y, letter }) => {
        grid[y][x] = letter; // 🔥 correction essentielle
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
