# LEVELUP

Marketing site for LEVELUP — a competitive fitness gaming concept that turns
bodyweight training into a ranked ladder game: AI form tracking, daily quests,
clans, global leaderboards, and coins redeemable for game credit or cash.

The site includes a limited, interactive in-browser preview of the app
(`src/prototype/LevelUpPrototype.jsx`) embedded in a phone frame. The preview
runs entirely client-side with no account, no real camera, and no real
payments — shop checkout and reward redemption are intentionally disabled,
and progress resets on refresh.

## Stack

React + Vite, plain CSS (no UI framework).

## Structure

- `src/components/` — marketing sections (nav, hero, features, how it works,
  compete/clans, shop, FAQ, footer) and the `DemoSection` phone-frame wrapper.
- `src/data/content.js` — copy and data shared across the marketing sections.
- `src/prototype/LevelUpPrototype.jsx` — the interactive demo app.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run lint     # oxlint
```
