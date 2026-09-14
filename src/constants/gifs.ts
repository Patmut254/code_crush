/**
 * Central place for every animated GIF used in the game.
 * Using remote Giphy URLs for hackathon speed — for the Play Store build,
 * download these once and put them in assets/gifs/ then flip USE_LOCAL to true
 * (local files avoid a network dependency and load instantly).
 */

export const USE_LOCAL = false;

export const GIFS = {
  wordCorrect: {
    remote: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif', // small sparkle burst
    local: require('../assets/gifs/word_correct.gif'),
  },
  levelComplete: {
    remote: 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif', // confetti
    local: require('../assets/gifs/level_complete.gif'),
  },
  streakFire: {
    remote: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // fire
    local: require('../assets/gifs/streak_fire.gif'),
  },
  toddlerCheer: {
    remote: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif', // big friendly clap
    local: require('../assets/gifs/toddler_cheer.gif'),
  },
  unlock: {
    remote: 'https://media.giphy.com/media/l0HlQXlQ3nHyLMvte/giphy.gif', // chest/unlock sparkle
    local: require('../assets/gifs/unlock.gif'),
  },
  sadTryAgain: {
    remote: 'https://media.giphy.com/media/3o7abKCOVJextH8dPa/giphy.gif', // gentle, not harsh
    local: require('../assets/gifs/try_again.gif'),
  },
} as const;

export type GifKey = keyof typeof GIFS;

export function gifSource(key: GifKey) {
  return USE_LOCAL ? GIFS[key].local : { uri: GIFS[key].remote };
}
