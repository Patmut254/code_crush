/**
 * Age profiles drive almost everything: input method, grid size, word length,
 * how forgiving the game is, and how "loud"/animated the UI is.
 * Chosen once at onboarding, changeable later from Profile screen.
 */

export type AgeGroup = 'toddler' | 'kid' | 'teen' | 'adult';

export interface AgeProfile {
  id: AgeGroup;
  label: string;
  ageRange: string;
  /** how the player forms a word */
  inputMode: 'tapInOrder' | 'dragTrace';
  /** biggest grid allowed for this profile, e.g. 3 -> 3x3 */
  maxGridSize: number;
  minGridSize: number;
  /** longest target word allowed */
  maxWordLength: number;
  /** starting + max lives */
  startingLives: number;
  /** ms before a life regenerates (lower = friendlier) */
  lifeRegenMs: number;
  /** do wrong attempts cost a life at all? */
  wrongAttemptsCostLives: boolean;
  /** free hints granted per level */
  freeHintsPerLevel: number;
  /** show a big glowing "next letter" nudge so they can't really fail */
  guidedMode: boolean;
  /** UI scale multiplier for text/touch targets */
  uiScale: number;
  /** show combo multiplier / score pressure UI */
  showScorePressure: boolean;
  /** play extra celebratory gif+sound on every single correct word, not just level end */
  celebrateEveryWord: boolean;
  /** allowed worlds (indices) — toddlers don't need "Tech Master" jargon */
  allowedWorlds: number[];
}

export const AGE_PROFILES: Record<AgeGroup, AgeProfile> = {
  toddler: {
    id: 'toddler',
    label: 'Little Coder',
    ageRange: '3–6',
    inputMode: 'tapInOrder', // tap letters in glowing order, no dragging precision needed
    maxGridSize: 3,
    minGridSize: 3,
    maxWordLength: 4,
    startingLives: 99, // effectively unlimited — no punishment
    lifeRegenMs: 0,
    wrongAttemptsCostLives: false,
    freeHintsPerLevel: 99, // hints always available
    guidedMode: true,
    uiScale: 1.4,
    showScorePressure: false,
    celebrateEveryWord: true,
    allowedWorlds: [0], // World 1 only, simplest words (CODE, BUG, APP...)
  },
  kid: {
    id: 'kid',
    label: 'Junior Dev',
    ageRange: '7–12',
    inputMode: 'dragTrace',
    maxGridSize: 4,
    minGridSize: 3,
    maxWordLength: 6,
    startingLives: 7,
    lifeRegenMs: 5 * 60 * 1000, // 5 min
    wrongAttemptsCostLives: false,
    freeHintsPerLevel: 5,
    guidedMode: true,
    uiScale: 1.15,
    showScorePressure: false,
    celebrateEveryWord: true,
    allowedWorlds: [0, 1],
  },
  teen: {
    id: 'teen',
    label: 'Code Rookie',
    ageRange: '13–17',
    inputMode: 'dragTrace',
    maxGridSize: 5,
    minGridSize: 4,
    maxWordLength: 9,
    startingLives: 5,
    lifeRegenMs: 15 * 60 * 1000,
    wrongAttemptsCostLives: true,
    freeHintsPerLevel: 3,
    guidedMode: false,
    uiScale: 1.0,
    showScorePressure: true,
    celebrateEveryWord: false,
    allowedWorlds: [0, 1, 2],
  },
  adult: {
    id: 'adult',
    label: 'Senior Dev',
    ageRange: '18+',
    inputMode: 'dragTrace',
    maxGridSize: 6,
    minGridSize: 4,
    maxWordLength: 12,
    startingLives: 5,
    lifeRegenMs: 20 * 60 * 1000,
    wrongAttemptsCostLives: true,
    freeHintsPerLevel: 3,
    guidedMode: false,
    uiScale: 1.0,
    showScorePressure: true,
    celebrateEveryWord: false,
    allowedWorlds: [0, 1, 2, 3],
  },
};

export function getAgeProfile(group: AgeGroup): AgeProfile {
  return AGE_PROFILES[group];
}

/** Rough helper to map a typed age (from onboarding) to a profile id */
export function ageToGroup(age: number): AgeGroup {
  if (age <= 6) return 'toddler';
  if (age <= 12) return 'kid';
  if (age <= 17) return 'teen';
  return 'adult';
}
