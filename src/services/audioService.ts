import { Audio } from 'expo-av';

// Drop your own royalty-free .mp3/.wav files into src/assets/sfx/ with these names.
// require() targets that don't exist yet will fail Metro's bundling step, so
// keep placeholder files there (see README) until you swap in real audio.
const SOUND_FILES: Record<string, any> = {
  select: require('../assets/sfx/select.mp3'),
  valid: require('../assets/sfx/valid.mp3'),
  invalid: require('../assets/sfx/invalid.mp3'),
  levelComplete: require('../assets/sfx/level_complete.mp3'),
  click: require('../assets/sfx/click.mp3'),
  unlock: require('../assets/sfx/unlock.mp3'),
};

const cache: Record<string, Audio.Sound> = {};

export async function playSfx(name: keyof typeof SOUND_FILES, enabled: boolean) {
  if (!enabled) return;
  try {
    let sound = cache[name];
    if (!sound) {
      const { sound: created } = await Audio.Sound.createAsync(SOUND_FILES[name]);
      cache[name] = created;
      sound = created;
    }
    await sound.replayAsync();
  } catch (e) {
    console.warn('[audio] failed to play', name, e);
  }
}

let musicInstance: Audio.Sound | null = null;

export async function startBackgroundMusic(enabled: boolean) {
  if (!enabled) return;
  try {
    if (musicInstance) return;
    const { sound } = await Audio.Sound.createAsync(require('../assets/sfx/music_loop.mp3'), {
      isLooping: true,
      volume: 0.4,
    });
    musicInstance = sound;
    await sound.playAsync();
  } catch (e) {
    console.warn('[audio] music failed', e);
  }
}

export async function stopBackgroundMusic() {
  try {
    await musicInstance?.stopAsync();
  } catch {
    /* noop */
  }
}
