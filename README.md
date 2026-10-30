# CodeCrush

A gamified coding game for adults. Plain HTML, CSS and JavaScript with Firebase (Auth + Firestore + Analytics). No build step.

## Run locally
Open `index.html`, or serve the folder: `npx serve .`

## Firebase setup (one time, in the console for project codecrush-2b7f4)
1. Build > Authentication > Sign-in method: enable **Email/Password**.
2. Build > Firestore Database: create a database, then paste `firestore.rules` into the Rules tab and publish.
3. Authentication > Settings > Authorized domains: add your Render domain, for example `codecrush.onrender.com`.

## Deploy on Render
Option A (dashboard): New > Static Site > connect the repo with this folder at its root. Build command: leave empty. Publish directory: `.`
Option B (blueprint): push the folder to GitHub and use New > Blueprint, which reads `render.yaml`.

## Lives
Players have 5 lives. A wrong answer costs one. Lives come back one at a time, every 20 minutes (`REGEN` in `js/app.js`). At 0 lives lessons are blocked until one returns.

## Editing content
- Levels and questions: 5,000 levels (4 tiers x 10 tracks x 125), 3 questions each, 1,500 different questions per track with no repeats inside a track.
  - `js/data.js`: tiers, tracks (icon + colour) and the 16 hand-written levels
  - `js/levels-gen.js`: question generators for JavaScript, Python, PHP, SQL, HTML, CSS, Networking, Logic, Debugging and Interview Prep, dealt into no-repeat decks
  - `js/vocab.js`: tech words and definitions used in vocabulary questions
- Unlocking: each track opens one level at a time; a tier opens after 25 passes in the tier before
- Colours and 3D effects: `css/style.css`
- Icons: inline SVG in `js/app.js` (`P` list); avatars and the welcome picture are in `assets/*.webp`
