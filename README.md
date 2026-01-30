# Maskle

A mobile-first, swipe-style web game where you match with masked dates and figure out who is human or alien.

## How to run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## How to add characters

1. Edit `src/data/characters.seed.json` and add a new character entry.
2. Provide `id`, `name`, `age`, `avatarSeed`, `tags`, `bio`, and a `profile` with `movies`, `shows`, `sports`, and `traits`.
3. The game auto-generates 10 questions per character from this seed in `src/data/characters.ts`.

Tip: keep each profile array at 3+ items so the question generator stays coherent.

## How to tune the alien algorithm

All tunables live in `src/lib/config.ts`:

- `alienChance` controls how often a match is an alien.
- `streakLimit`, `maxObviousLies`, and `minNonPerfectByEnd` control deception constraints.
- `suspicionWeights` and `suspicionThresholds` shape how the alien adapts.
- `glitch` sets how often the UI shows subtle visual glitches.
- `scoring` sets base points and bonuses.

## Storage adapter

The default in-memory store is in `src/store/memoryStore.ts`. The interface lives in `src/store/adapter.ts` so you can swap in Redis/Postgres later without refactors.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - lint
- `npm run format` - format with Prettier
