// Utilisée par :
// - CreateGrid.jsx (pour générer un aperçu avant l’enregistrement)
// - EditGrid.jsx (si l’édition permet de régénérer une grille)
//
// Rôle :
// Génère une grille de mots mêlés contenant tous les mots fournis,
// en les plaçant aléatoirement, puis en remplissant le reste de lettres aléatoires.
// La logique de placement (direction, collisions autorisées, limites) est
// entièrement gérée en interne pour laisser les composants front simplifiés.
export function generateGrid(size, words) {
  
  let grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );

  for (let word of words) {
    placeWord(grid, word.toUpperCase());
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Remplir ensuite garantit une grille visuellement homogène.
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

  // Toutes les directions possibles : augmente la variété visuelle.
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: -1 },
  ];

  // Placement aléatoire : stratégie simple mais efficace sans algorithmie lourde.
  while (!placed) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    const { dx, dy } = directions[Math.floor(Math.random() * directions.length)];

    // Vérification rapide pour éviter un parcours inutile du mot.
    const endRow = row + dy * (word.length - 1);
    const endCol = col + dx * (word.length - 1);
    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      continue;
    }

    let canPlace = true;

    // Autorise les croisements uniquement si cohérents (même lettre).
    for (let i = 0; i < word.length; i++) {
      const r = row + dy * i;
      const c = col + dx * i;

      if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
        canPlace = false;
        break;
      }
    }

    if (!canPlace) continue;

    // Placement effectif
    for (let i = 0; i < word.length; i++) {
      const r = row + dy * i;
      const c = col + dx * i;
      grid[r][c] = word[i];
    }

    placed = true;
  }
}
