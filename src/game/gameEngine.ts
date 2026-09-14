export function pointsForWord(length: number): number {
  if (length <= 3) return 30;
  if (length === 4) return 50;
  if (length === 5) return 75;
  return 100 + (length - 6) * 15;
}

export function comboMultiplier(consecutiveCorrect: number): number {
  if (consecutiveCorrect >= 4) return 2;
  if (consecutiveCorrect === 3) return 1.5;
  if (consecutiveCorrect === 2) return 1.2;
  return 1;
}

export interface RoundTally {
  score: number;
  mistakes: number;
  hintsUsed: number;
}

/**
 * Stars: 1 = finished at all, 2 = finished with a solid score, 3 = efficient
 * (few mistakes, no/low hint usage). Toddlers always get 3 — no punishing a 4 year old.
 */
export function calculateStars(tally: RoundTally, targetWordCount: number, guidedMode: boolean): 1 | 2 | 3 {
  if (guidedMode) return 3;
  if (tally.mistakes === 0 && tally.hintsUsed === 0) return 3;
  if (tally.mistakes <= Math.ceil(targetWordCount / 3) && tally.hintsUsed <= 1) return 2;
  return 1;
}
