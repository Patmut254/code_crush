import { AgeGroup } from './ageProfiles';

export interface Level {
  id: number;
  world: number; // 0-indexed, worlds 1-4 in UI
  gridSize: number;
  letters: string[]; // flattened gridSize*gridSize letters
  targetWords: string[];
  difficulty: number; // 1-10
}

const WORLDS: { name: string; words: string[] }[] = [
  { name: 'Coding Basics', words: ['CODE', 'BUG', 'APP', 'WEB', 'API', 'LOOP', 'DATA', 'BYTE', 'HTML', 'CSS'] },
  { name: 'Programming', words: ['PYTHON', 'JAVA', 'REACT', 'NODE', 'CLASS', 'ARRAY', 'OBJECT', 'FUNCTION', 'STRING', 'DEBUG'] },
  { name: 'Developer Tools', words: ['GIT', 'DOCKER', 'LINUX', 'NPM', 'GITHUB', 'CLOUD', 'TEST', 'CYPRESS', 'SERVER', 'BUILD'] },
  { name: 'Tech Master', words: ['DATABASE', 'JAVASCRIPT', 'TYPESCRIPT', 'ANGULAR', 'DJANGO', 'KOTLIN', 'MOBILE', 'BACKEND', 'FRONTEND', 'DEVELOPER'] },
];

const FILLER_LETTERS = 'AEIOURSTLN';

/** Builds a square grid that guarantees every target word can be traced via adjacent cells. */
function buildGridForWords(words: string[], gridSize: number): string[] {
  const size = gridSize * gridSize;
  const grid: string[] = new Array(size).fill('');
  const idx = (r: number, c: number) => r * gridSize + c;
  const dirs = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
  ];

  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const startR = Math.floor(Math.random() * gridSize);
      const startC = Math.floor(Math.random() * gridSize);
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      let r = startR;
      let c = startC;
      const path: number[] = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) { ok = false; break; }
        const cellIdx = idx(r, c);
        const existing = grid[cellIdx];
        if (existing && existing !== word[i]) { ok = false; break; }
        path.push(cellIdx);
        r += dr;
        c += dc;
      }
      if (ok) {
        path.forEach((cellIdx, i) => { grid[cellIdx] = word[i]; });
        placed = true;
      }
    }
  }

  // fill remaining empty cells with random filler letters (distractors)
  for (let i = 0; i < size; i++) {
    if (!grid[i]) grid[i] = FILLER_LETTERS[Math.floor(Math.random() * FILLER_LETTERS.length)];
  }
  return grid;
}

function generateLevels(): Level[] {
  const levels: Level[] = [];
  let id = 1;
  WORLDS.forEach((world, worldIdx) => {
    for (let i = 0; i < 10; i++) {
      const levelInWorld = i + 1; // 1..10
      // difficulty ramps within each world, and worlds ramp overall
      const difficulty = worldIdx * 2 + Math.ceil(levelInWorld / 4);
      const gridSize = Math.min(7, 4 + Math.floor(worldIdx / 2) + Math.floor(levelInWorld / 6));
      const wordCount = Math.min(8, 3 + Math.floor(levelInWorld / 3) + worldIdx);
      const wordsPool = [...world.words].sort(() => Math.random() - 0.5);
      const targetWords = wordsPool.slice(0, Math.min(wordCount, wordsPool.length));
      levels.push({
        id,
        world: worldIdx,
        gridSize,
        letters: buildGridForWords(targetWords, gridSize),
        targetWords,
        difficulty,
      });
      id++;
    }
  });
  return levels;
}

export const LEVELS: Level[] = generateLevels();

export const WORLD_META = WORLDS.map((w, i) => ({
  index: i,
  name: w.name,
  levelIds: LEVELS.filter((l) => l.world === i).map((l) => l.id),
}));

/** Filters + rebuilds a level so it respects an age profile's max grid/word-length limits. */
export function getAgeAppropriateLevel(level: Level, ageGroup: AgeGroup, maxGridSize: number, maxWordLength: number): Level {
  const words = level.targetWords.filter((w) => w.length <= maxWordLength);
  const finalWords = words.length ? words : level.targetWords.slice(0, 1);
  const gridSize = Math.min(level.gridSize, Math.max(3, maxGridSize));
  return {
    ...level,
    gridSize,
    letters: buildGridForWords(finalWords, gridSize),
    targetWords: finalWords,
  };
}

export function isWorldUnlocked(worldIndex: number, ageAllowedWorlds: number[], completedLevelIds: number[]): boolean {
  if (!ageAllowedWorlds.includes(worldIndex)) return false;
  if (worldIndex === 0) return true;
  const prevWorldLevels = LEVELS.filter((l) => l.world === worldIndex - 1).map((l) => l.id);
  return prevWorldLevels.every((id) => completedLevelIds.includes(id));
}
