/*
  LEVELS-DATA.JS
  --------------
  This file is pure content: it contains no game logic.
  The engine (game.js) reads this data and builds boards, milestones,
  and rewards from it. To add a new level, add an object to LEVELS.
  To add a new world, add an object to WORLDS and point levels at it.
*/

const WORLDS = [
  {
    id: 'computer-basics',
    name: 'Computer Basics',
    subtitle: 'Where every developer starts',
    accent: '#3FD3FF',
    accent2: '#2E5CFF',
    bg: '#2C7BE5',
    bg2: '#0B2C6B',
    icon: 'cpu'
  },
  {
    id: 'programming-basics',
    name: 'Programming Basics',
    subtitle: 'Thinking like a coder',
    accent: '#FFC24B',
    accent2: '#FF4F81',
    bg: '#E0356F',
    bg2: '#7A0E2E',
    icon: 'code'
  }
];

// Each level lists REQUIRED milestone words only (2-3 words).
// gridSize and rewards are derived automatically by the engine from
// word count/length, but can be overridden here if you want to hand-tune one.
const LEVELS = [
  // ---------------- WORLD 1 — COMPUTER BASICS (1-10) ----------------
  { id: 1,  world: 'computer-basics', title: 'First Boot',        milestones: ['BYTE', 'DATA'] },
  { id: 2,  world: 'computer-basics', title: 'Point & Click',     milestones: ['MOUSE', 'DISK'] },
  { id: 3,  world: 'computer-basics', title: 'Picture This',      milestones: ['PIXEL', 'ICON'] },
  { id: 4,  world: 'computer-basics', title: 'Desktop Life',      milestones: ['FOLDER', 'SCREEN'] },
  { id: 5,  world: 'computer-basics', title: 'Input & Output',    milestones: ['KEYBOARD', 'MONITOR'] },
  { id: 6,  world: 'computer-basics', title: 'Ones and Zeros',    milestones: ['BINARY', 'SOFTWARE'] },
  { id: 7,  world: 'computer-basics', title: 'Under the Hood',    milestones: ['HARDWARE', 'MEMORY'] },
  { id: 8,  world: 'computer-basics', title: 'The Brain',         milestones: ['PROCESSOR', 'STORAGE'] },
  { id: 9,  world: 'computer-basics', title: 'Getting Online',    milestones: ['NETWORK', 'BROWSER'] },
  { id: 10, world: 'computer-basics', title: 'Welcome to the Web', milestones: ['INTERNET', 'WEBSITE', 'DEVICE'], boss: true },

  // ---------------- WORLD 2 — PROGRAMMING BASICS (11-20) ----------------
  { id: 11, world: 'programming-basics', title: 'Hello World',     milestones: ['CODE', 'LOOP'] },
  { id: 12, world: 'programming-basics', title: 'Squash It',       milestones: ['BUG', 'FIX'] },
  { id: 13, world: 'programming-basics', title: 'Building Blocks', milestones: ['ARRAY', 'CLASS'] },
  { id: 14, world: 'programming-basics', title: 'Name It',         milestones: ['FUNCTION', 'VARIABLE'] },
  { id: 15, world: 'programming-basics', title: 'True or False',   milestones: ['STRING', 'BOOLEAN'] },
  { id: 16, world: 'programming-basics', title: 'What It Knows',   milestones: ['OBJECT', 'METHOD'] },
  { id: 17, world: 'programming-basics', title: 'Ship It',         milestones: ['COMPILE', 'DEBUG'] },
  { id: 18, world: 'programming-basics', title: 'By the Rules',    milestones: ['ALGORITHM', 'SYNTAX'] },
  { id: 19, world: 'programming-basics', title: 'Round Again',     milestones: ['RECURSION', 'ITERATION'] },
  { id: 20, world: 'programming-basics', title: 'Level Up',        milestones: ['PYTHON', 'JAVASCRIPT', 'DEVELOPER'], boss: true }
];

// A short flavor fact shown when a milestone word is completed.
// Purely optional polish — missing entries just show nothing extra.
const WORD_FACTS = {
  BYTE: '8 bits make a byte.',
  DATA: 'Data is just information a computer can store.',
  MOUSE: 'Invented in 1964 — it was made of wood.',
  DISK: 'Early disks stored kilobytes; today\'s store terabytes.',
  PIXEL: 'Short for "picture element."',
  ICON: 'A small image that stands in for an action.',
  FOLDER: 'A container that keeps files organized.',
  SCREEN: 'Where pixels become pictures.',
  KEYBOARD: 'The QWERTY layout is over 150 years old.',
  MONITOR: 'Your window into everything the computer does.',
  BINARY: 'Every file boils down to 1s and 0s.',
  SOFTWARE: 'Instructions a computer follows — no shape, no weight.',
  HARDWARE: 'The physical parts you can actually touch.',
  MEMORY: 'Where the computer keeps what it\'s working on right now.',
  PROCESSOR: 'The chip that runs every instruction.',
  STORAGE: 'Where things stay even after you power off.',
  NETWORK: 'Computers talking to other computers.',
  BROWSER: 'Your window into the web.',
  INTERNET: 'A network of networks, spanning the globe.',
  WEBSITE: 'A page (or pages) living on the internet.',
  DEVICE: 'Any gadget that can run software.',
  CODE: 'Instructions written in a language computers understand.',
  LOOP: 'Repeats a block of code until told to stop.',
  BUG: 'An error in code — named after an actual moth in 1947.',
  FIX: 'What you do right after finding a bug.',
  ARRAY: 'An ordered list of values.',
  CLASS: 'A blueprint for creating objects.',
  FUNCTION: 'A reusable block of code with a name.',
  VARIABLE: 'A named container that holds a value.',
  STRING: 'Text, wrapped in quotes.',
  BOOLEAN: 'Only ever true or false.',
  OBJECT: 'A bundle of related data and behavior.',
  METHOD: 'A function that belongs to an object.',
  COMPILE: 'Turning source code into something a machine can run.',
  DEBUG: 'Hunting down and fixing the bug.',
  ALGORITHM: 'A step-by-step recipe for solving a problem.',
  SYNTAX: 'The grammar rules of a programming language.',
  RECURSION: 'A function that calls itself.',
  ITERATION: 'Repeating a process, one step at a time.',
  PYTHON: 'Named after Monty Python, not the snake.',
  JAVASCRIPT: 'Written in 10 days in 1995.',
  DEVELOPER: 'Someone who builds software for a living.'
};

if (typeof module !== 'undefined') {
  module.exports = { WORLDS, LEVELS, WORD_FACTS };
}
