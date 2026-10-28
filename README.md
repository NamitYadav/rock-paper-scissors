# Rock Paper Scissors

Play Rock Paper Scissors against the computer, or watch two computers play each other. The score and game type are kept between visits.

**Live:** https://namityadav.github.io/rock-paper-scissors/

## How it's built

- React 19 and TypeScript, built with Vite.
- All game rules live in one pure reducer (`src/rules.ts`). The UI only dispatches actions, so the rules are tested without rendering anything.
- A round is a short shuffle animation driven by an interval, then a single `settle` action that judges the throw and updates the score. Controls are disabled mid-round, so a double click can't score twice.
- Only the game type and score go into `localStorage`, and malformed data falls back to a fresh game.
- Every push to `main` runs the tests and the build, and GitHub Actions deploys the result to GitHub Pages.

## Run it

```bash
npm install
npm run dev
npm test
```
