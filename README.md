# Udi's Hold'em Trainer

A single-file, browser-based 9-max Texas Hold'em trainer for drilling GTO-style decisions across preflop and postflop streets. No install, no build, no backend — just open `index.html`.

## Live demo

https://<your-username>.github.io/holdem-trainer/

## What it does

You're dealt a hand at a 9-max table and asked to pick the correct action. Answer, get instant feedback, move to the next hand. Six scenarios covering the full street progression:

- **Preflop — RFI (Raise First In):** open-raise the right hands from every position
- **Preflop — Facing a raise:** 3-bet, call, or fold against an opener
- **Flop — As the preflop aggressor:** continuation-bet spots across board textures
- **Flop — As the preflop caller:** check-raise, call, or fold against a c-bet
- **Turn — Barreling decisions:** when to fire a second barrel
- **River — Value and bluff selection:** final street polarization

Two app modes:

- **Practice:** unlimited hands in a mode you pick — drill a single scenario as long as you want.
- **Test:** 20 hands randomly mixed across all six modes, then post your score to the leaderboard.

Plus:

- **Weekly leaderboard** — top 10 scores from the past 7 days, shared across devices.
- **Always-on leaderboard button** in the header.
- **Sarcastic feedback** after each answer so 20-hand tests don't feel like flashcards.
- **Hand history + mistakes list** at the end of each test, so you can see exactly which spots you misplayed.

## How the "right answer" is determined

The preflop ranges are lookup tables approximating published solver-derived GTO charts at 100bb. Each hand is pre-classified as raise / call / fold based on your position and (for facing-raise spots) the opener's position.

The postflop logic is a hand-written rule set, not a real solver. It classifies your holding (set, top pair with kicker strength, overpair, draws, etc.) and the board's texture (high/mid/low, paired, monotone, two-tone, connectedness, wetness), then applies heuristics that mimic the broad conclusions solvers reach — range-advantage c-bets, check-raise with equity + blockers, polarized river betting, and so on.

This means it's useful for drilling the big-picture heuristics but will sometimes mark you "wrong" on a spot where a real solver would mix strategies. Treat it as a pattern-recognition tool, not gospel.

## Setup

Just open `index.html` in any modern browser. No dependencies.

### Optional: cross-device leaderboard

By default the leaderboard is per-device (each browser keeps its own). To sync scores across phones, laptops, and friends, plug in a free JSONBin.io bin:

1. Sign up at [jsonbin.io](https://jsonbin.io) (free tier is plenty).
2. Create a bin with content `{"entries":[]}`.
3. In `index.html`, find the `CLOUD` object near the top of the main `<script>` block.
4. Paste your Bin ID and X-Master-Key:
   ```js
   const CLOUD = {
     binId: 'your-bin-id-here',
     masterKey: 'your-master-key-here',
   };
   ```
5. Redeploy. The leaderboard header will now say `synced` instead of `this device only`.

Leave either field empty to fall back to per-device storage.

## Deployment

The trainer is a single static HTML file. It deploys anywhere that serves static files:

- **GitHub Pages** (this repo) — push `index.html` to `main`, enable Pages, done.
- **Netlify Drop** — drag `index.html` onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages, Vercel, any static host** — upload `index.html`.

## Keyboard shortcuts

- `F` — Fold
- `C` — Call
- `R` — Raise
- `K` — Check
- `B` — Bet
- `Space` / `Enter` — Next hand (or start next test)
- `Esc` — Close the leaderboard modal

## Tech

- Vanilla HTML/CSS/JS, single file, ~2,000 lines
- No build step, no dependencies, no framework
- Weekly leaderboard via JSONBin REST API (optional)
- Client-side hand evaluator and board-texture classifier

## Disclaimers

- This is an approximation of GTO, not actual solver output. See "How the 'right answer' is determined" above.
- Assumes 100bb cash-game sizings.
- Not for real-money advice; use it to drill patterns, not as a live-play crutch.
