# Abledots: A Life-like "Game of Life" Cellular Automata game

# Codebase

## Seed code
The best approach on the interwebs to date (that I've found) for using canvas for cell rendering, I'd credit entirely to **spicy yogurt**, (:pray: big hat tip!) via this article:
- https://spicyyoghurt.com/tutorials/javascript/conways-game-of-life-canvas

Before _abledots_ I had had zero reasons to wrangle HTMLCanvas, for anything, _ever_. **Spicy yogurt's** article is such an elegant introduction to the problem domain that I didn't even get to the end of the article; I started implementing right away (and immediately ran into trouble which I had to backtrack and fix, only to find out it's discussed a little later on the page, haha). Got the origin game (the `B3/S23` ruleset) up and running after tweaking the approach slightly, with a view to imposing new rules and parameters over time.


**Approach**
The rendering approach uses HTML Canvas directly (as mentioned above), with:
- A `Grid` class to encapsulate grid / layout concerns as well as (for now) implementing the main GOL algo. I foresee algo implementation being abstracted to a higher level "game" component eventually.
- A `Cell` class to represent individual cells (the cell matrix is "superimposed" onto a simple array with a wee bit of coordinate math).
- The browser's `requestAnimationFrame` hook for smooth rendering.

## Developer Guide
- This codebase uses typescript and is based on a nodejs **[vite](https://vitejs.dev/)** app with support for **[svelte](https://svelte.dev/)**.
- The package manager for this repo is `pnpm`, so to run the app after pulling / forking this repo:
  - `pnpm install`
  - `pnpm dev`
- There are two apps:
  - `GOL.svelte` - the main app
  - `Test.svelte` - a visual testing app. For now it is just three 3x3 grids representing initial state and 2 follow-up iterations. The test variant cells have a larger aperture and are labelled; additionally there are some extra console logs for debugging.

---

# Rulesets / Experiments
- :white_check_mark: done
- :test_tube: in progress
- :wastebasket: abandoned

ruleset id | shorthand | name & description| status
-----------|-----------|---------------------------|-----
1 | B3/S23 | Original [Conway's game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). | :white_check_mark: done