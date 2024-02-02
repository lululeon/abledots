# Approach

The rendering approach uses HTML Canvas directly (as mentioned above), with:

- A `Grid` class to encapsulate grid / layout concerns (the cell matrix is "superimposed" onto a simple array with a wee bit of coordinate math).
- A `Cell` class to represent individual cells affected by the algos.
- Some `RuleExpression` variants to abstract away concerns about how each algo is implemented: they get callbacks to do whatever it is they need to do.
- A `RulesEngine` class which instantiates and manages all the rules to be applied to the grid

The browser's `requestAnimationFrame` hook is used for smooth rendering (though, updates aren't frenetic enough to really run into rendering issues).

The objs are pretty loose/open, esp the Grid class - honestly just a glorified POJO masquerading behind 'Class'-ist pretensions... Also, I foresee chunks of implementation being abstracted to a higher level "game" component eventually.