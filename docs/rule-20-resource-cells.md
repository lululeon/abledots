# R20 - Introduce Resource cells

The introduction of this rule is meant to allow some cells to start out as simple resource cells (green on the grid) which simply confer "health" points to cells in their immediate vicinity.

For now:

- resources are not depletable
- each deemed "alive" cell with `r` Resource cells in its neighborhood gets `r` health points at start of game.
- the S23 death algo must now decrement health first, and the cell dies only if health is 0.
