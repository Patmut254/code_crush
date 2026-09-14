import { isAdjacent } from '@/utils/grid';

export interface ValidationResult {
  valid: boolean;
  word: string;
  alreadyFound: boolean;
}

/** Confirms the dragged/tapped path is a legal trace (adjacent, no repeats) */
export function isPathLegal(path: number[], gridSize: number): boolean {
  if (path.length === 0) return false;
  const seen = new Set<number>();
  for (let i = 0; i < path.length; i++) {
    if (seen.has(path[i])) return false;
    seen.add(path[i]);
    if (i > 0 && !isAdjacent(path[i - 1], path[i], gridSize)) return false;
  }
  return true;
}

export function wordFromPath(path: number[], letters: string[]): string {
  return path.map((i) => letters[i]).join('');
}

export function validateWord(
  path: number[],
  letters: string[],
  gridSize: number,
  targetWords: string[],
  foundWords: string[],
): ValidationResult {
  if (!isPathLegal(path, gridSize)) {
    return { valid: false, word: '', alreadyFound: false };
  }
  const word = wordFromPath(path, letters);
  const isTarget = targetWords.includes(word);
  const alreadyFound = foundWords.includes(word);
  return { valid: isTarget && !alreadyFound, word, alreadyFound };
}
