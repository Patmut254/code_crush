/*
  BOARD-GENERATOR.JS
  -------------------
  Turns a list of required words into a solvable letter grid.

  How it works:
  1. Pick a grid size big enough for the longest word.
  2. For each word (longest first), try to "walk" it onto the grid:
     start at a random empty cell (or a cell that already has the
     word's first letter), then move to a random unvisited neighbor
     (8 directions) whose cell is empty OR already holds the letter
     you need next. Backtrack if you paint yourself into a corner.
  3. Once every word is placed, fill the remaining empty cells with
     random filler letters so the solution isn't obvious at a glance.
  4. If placement fails, retry with a fresh empty grid (a few times)
     before falling back to a larger grid size.

  This keeps content (levels-data.js) completely separate from the
  algorithm that turns it into a playable board.
*/

const FILLER_LETTERS = 'ETAOINSHRDLCUMWFGYPBVKJXQZ'; // rough English frequency order

function pickGridSize(words) {
  const longest = Math.max(...words.map(w => w.length));
  return Math.min(9, Math.max(6, longest - 1));
}

function neighborsOf(index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  const out = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        out.push(r * size + c);
      }
    }
  }
  return out;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function tryPlaceWord(grid, size, word) {
  const startCandidates = shuffle(
    grid.map((_, i) => i).filter(i => grid[i] === null || grid[i] === word[0])
  );

  for (const start of startCandidates) {
    const visited = new Set([start]);
    const path = [start];

    function walk(idx) {
      if (idx === word.length) return true;
      const current = path[path.length - 1];
      const options = shuffle(neighborsOf(current, size)).filter(n => {
        if (visited.has(n)) return false;
        return grid[n] === null || grid[n] === word[idx];
      });
      for (const next of options) {
        visited.add(next);
        path.push(next);
        if (walk(idx + 1)) return true;
        path.pop();
        visited.delete(next);
      }
      return false;
    }

    if (walk(1)) {
      path.forEach((cell, i) => { grid[cell] = word[i]; });
      return path;
    }
  }
  return null;
}

/**
 * Generates a board for the given milestone words.
 * Returns { size, letters, wordPaths } where wordPaths maps
 * WORD -> array of cell indices in order.
 */
function generateBoard(words) {
  const upperWords = words.map(w => w.toUpperCase()).sort((a, b) => b.length - a.length);
  let size = pickGridSize(upperWords);

  for (let sizeAttempt = 0; sizeAttempt < 3; sizeAttempt++) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const grid = new Array(size * size).fill(null);
      const wordPaths = {};
      let ok = true;

      for (const word of upperWords) {
        const path = tryPlaceWord(grid, size, word);
        if (!path) { ok = false; break; }
        wordPaths[word] = path;
      }

      if (ok) {
        for (let i = 0; i < grid.length; i++) {
          if (grid[i] === null) {
            grid[i] = FILLER_LETTERS[Math.floor(Math.random() * FILLER_LETTERS.length)];
          }
        }
        return { size, letters: grid, wordPaths };
      }
    }
    size = Math.min(9, size + 1); // widen the board and try again
  }

  throw new Error('Could not generate a board for: ' + upperWords.join(', '));
}

if (typeof module !== 'undefined') {
  module.exports = { generateBoard };
}
