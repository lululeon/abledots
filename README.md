# Abledots: A Life-like "Game of Life" Cellular Automata game

## Seed code

The best approach on the interwebs to date (that I've found) for using canvas for cell rendering, I'd credit entirely to **spicy yogurt**, (:pray: big hat tip!) via this article:

- https://spicyyoghurt.com/tutorials/javascript/conways-game-of-life-canvas

Before _abledots_ I had had zero reasons to wrangle HTMLCanvas, for anything, _ever_. **Spicy yogurt's** article is such an elegant introduction to the problem domain that I didn't even get to the end of the article; I started implementing right away (and immediately ran into trouble which I had to backtrack and fix, only to find out it's discussed a little later on the page, haha). Got the origin game (the `B3/S23` ruleset) up and running after tweaking the approach slightly, with a view to imposing new rules and parameters over time.

## Docs
- [approach](./docs/approach.md)
- [dev guide](./docs/dev-guide.md)

---

# Codebase

**Run the app**

- clone this repo
- `pnpm install`
- `pnpm dev`

**TODOs**

- [x] add prettier
- [ ] remove remnants of sample vite app
- [ ] proper app interface / ux (learn svelte, lol)
- [x] impl iteration modes/config so that rulesets can be enabled/disabled
- [x] refactor classes a bit to separate out rules engine(s)
- [ ] rename cell, grid methods to better align with RulesEngine naming / refine naming
- [ ] document rules engine
- [ ] impl rulewise injectable / custom cell metadata
- [ ] generalized "neighbors reducer" with ability to register checks from each RuleExpression so that we don't execute that loop more times than we have to

---

# Rulesets / Experiments

- :white_check_mark: done
- :test_tube: in progress
- :wastebasket: abandoned

**Some Nomenclature**

- $N_{0}$ = neigborhood (inner 8 cells)
- $N_{1}$ = next ring of neighbours (the 16 cells surrounding $N_{0}$)

| ruleset id | shorthand | basis   | name & description                                                                       | status                  |
| ---------- | --------- | ------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| 10         | B3/S23    | $N_{0}$ | Original [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). | :white_check_mark: done |
| 20         | R         | $N_{0}$ | Randomly seed 10% of cells as [resource cells](docs/rule-20-resource-cells.md).        | :white_check_mark: done |
| 30         | TR        | $N_{0}$ | Movement toward resource cells                                                           | :test_tube: in progress |
