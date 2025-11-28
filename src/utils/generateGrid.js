export function generateGrid(size, words) {
  let grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );

  for (let word of words) {
    placeWord(grid, word.toUpperCase());
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
}

function placeWord(grid, word) {
  const size = grid.length;
  let placed = false;

  // 8 directions possibles
  const directions = [
    { dx: 1, dy: 0 },   // →
    { dx: -1, dy: 0 },  // ←
    { dx: 0, dy: 1 },   // ↓
    { dx: 0, dy: -1 },  // ↑
    { dx: 1, dy: 1 },   // ↘
    { dx: -1, dy: 1 },  // ↙
    { dx: 1, dy: -1 },  // ↗
    { dx: -1, dy: -1 }, // ↖
  ];

  while (!placed) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    // choisir une direction aléatoire
    const { dx, dy } = directions[Math.floor(Math.random() * directions.length)];

    // vérifier si le mot tient dans la grille
    let endRow = row + dy * (word.length - 1);
    let endCol = col + dx * (word.length - 1);

    if (
      endRow < 0 ||
      endRow >= size ||
      endCol < 0 ||
      endCol >= size
    ) {
      continue; // dépasse → recommence
    }

    // vérifier collisions
    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dy * i;
      const c = col + dx * i;

      if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
        canPlace = false;
        break;
      }
    }

    if (!canPlace) continue;

    // placer le mot
    for (let i = 0; i < word.length; i++) {
      const r = row + dy * i;
      const c = col + dx * i;
      grid[r][c] = word[i];
    }

    placed = true;
  }
}
