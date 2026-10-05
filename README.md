# Pigment

Interactive RYBW pigment-mixing simulator.

The app lets you:

- enter real sensor RGB values for red, yellow, blue, and water precursors
- use integer RYBW ratios constrained to sum to 10
- generate feasible target colors from integer mixtures
- compare target and mix colors using CIEDE2000, Lab Delta E 76, Fréchet, RGB, Helmlab, and JND
- run a BO-style convergence probe seeded from the RGB estimate

The deployable Worker entrypoint is `dist/server/index.js`.
