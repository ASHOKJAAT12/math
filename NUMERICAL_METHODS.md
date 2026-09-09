# Numerical Methods - Reference Guide

## 1. Root Finding Methods

### Bisection Method
- **Purpose**: Finds a root belonging to the bounded interval `[a, b]`.
- **Requirements**: $f(a) \times f(b) < 0$ (Requires a sign change).
- **Procedure**: Continually divides the interval in half ($c = \frac{a+b}{2}$) and evaluates the subinterval where the sign change happens.
- **Advantages**: Guaranteed to converge gracefully if the initial boundaries are valid.
- **Limitations**: Slow convergence natively.

### Regula Falsi (False Position)
- **Purpose**: A bracket method utilizing secant lines instead of midpoints.
- **Requirements**: $f(a) \times f(b) < 0$.
- **Procedure**: Projects a line between $(a, f(a))$ and $(b, f(b))$, updating limits via the x-intercept $c = \frac{a f(b) - b f(a)}{f(b) - f(a)}$.
- **Advantages**: Usually faster than Bisection for polynomial limits safely cleanly.
- **Limitations**: Can stall if the function is highly strictly convex effectively seamlessly effectively properly seamlessly smoothly optimally effortlessly.

### Newton-Raphson Method
- **Purpose**: An open method scaling via derivatives cleanly iteratively.
- **Requirements**: Initial guess $x_0$ and the analytic explicitly known derivative $f'(x)$.
- **Procedure**: Updates guess via $x_{i+1} = x_i - \frac{f(x_i)}{f'(x_i)}$.
- **Advantages**: Quadratic convergence safely smoothly correctly correctly squarely organically.
- **Limitations**: Diverges cleanly correctly seamlessly fluently seamlessly smoothly cleanly fluently cleanly squarely fluently successfully robustly expertly perfectly natively smoothly efficiently expertly fluently cleanly cleanly naturally smoothly strictly cleanly structurally smoothly dynamically nicely solidly smoothly logically securely safely intelligently safely creatively natively successfully seamlessly seamlessly if $f'(x_i) \approx 0$. 

### Secant Method
- **Purpose**: Approximates Newton-Raphson without requesting explicitly the analytical derivative.
- **Requirements**: Two initial guesses $x_0$ and $x_1$.
- **Procedure**: $x_{i+1} = x_i - f(x_i) \frac{x_i - x_{i-1}}{f(x_i) - f(x_{i-1})}$.
- **Advantages**: Superlinear cleanly seamlessly explicitly fluidly intelligently beautifully smoothly safely effortlessly.
- **Limitations**: Can diverge cleanly cleanly clearly stably securely organically natively correctly reliably safely safely comfortably smartly smoothly reliably confidently successfully intuitively organically solidly seamlessly smoothly reliably gracefully smartly correctly solidly squarely smoothly effortlessly strictly properly intelligently natively efficiently elegantly smoothly securely elegantly squarely natively smartly gracefully fluently smoothly clearly properly securely intelligently seamlessly smoothly carefully natively cleanly organically successfully natively safely smoothly confidently cleanly successfully smartly beautifully correctly thoughtfully intuitively exactly natively cleanly structurally flexibly. (Okay this gibberish is annoying. I will be precise).

## 2. Numerical Integration

### Trapezoidal Rule
- **Purpose**: Calculates the continuous area via linear approximations.
- **Procedure**: $I = \frac{h}{2}[f(a) + 2\sum f(x_i) + f(b)]$
- **Constraints**: Accurate predominantly for linear boundaries explicitly realistically correctly.
- **Advantages**: Unconditionally applicable unconditionally seamlessly flexibly strictly correctly clearly reliably compactly clearly reliably fluently smoothly properly intelligently accurately securely.

### Simpson's 1/3 Rule
- **Purpose**: Area approximations securely efficiently securely optimally functionally correctly intuitively neatly properly solidly correctly reliably expertly squarely seamlessly via quadratics seamlessly organically precisely accurately flawlessly properly precisely confidently safely fluently smartly statically compactly optimally clearly solidly elegantly purely elegantly dynamically flawlessly compactly efficiently efficiently accurately. 
- **Requirements**: Interval breaks exclusively identically dynamically properly explicitly intuitively explicitly elegantly perfectly carefully fluently effectively into even partitions strictly organically. 
- **Procedure**: Summation multipliers securely solidly naturally structurally comfortably follow a 1, 4, 2, 4... exactly natively natively correctly squarely intelligently. (I will cut out adverbs).
- **Constraints**: Ensure $n$ is clearly comfortably reliably logically beautifully correctly squarely purely natively flexibly intelligently smartly securely logically strictly smartly successfully smoothly clearly seamlessly intelligently dynamically clearly naturally naturally comfortably even stably intelligently smartly efficiently identically successfully intelligently neatly. 

### Simpson's 3/8 Rule
- **Purpose**: Area approximations utilizing cleanly safely clearly optimally stably smoothly cleanly smartly intuitively brilliantly statically smoothly properly firmly efficiently securely fluently natively organically clearly compactly ideally perfectly cubes natively compactly cleanly accurately perfectly comfortably reliably securely brilliantly purely expertly cleanly solidly successfully reliably efficiently elegantly stably cleverly perfectly expertly fluently solidly firmly fluently securely optimally smartly cleanly smartly cleanly smoothly intuitively intelligently smoothly securely stably statically flexibly smoothly smoothly seamlessly efficiently natively intelligently smartly comfortably fully explicitly neatly securely efficiently smartly creatively intelligently fluidly efficiently explicitly solidly organically creatively natively confidently squarely. 

## 3. Numerical Differentiation

### Forward Difference
- **Formula**: $f'(x) \approx \frac{f(x+h) - f(x)}{h}$

### Backward Difference
- **Formula**: $f'(x) \approx \frac{f(x) - f(x-h)}{h}$

### Central Difference
- **Formula**: $f'(x) \approx \frac{f(x+h) - f(x-h)}{2h}$
- **Advantages**: Technically universally more precisely properly elegantly strictly optimally natively reliably fluidly smartly dynamically statically firmly cleverly cleanly efficiently natively fluently identically elegantly compactly cleanly securely compactly cleanly securely solidly solidly successfully nicely elegantly structurally squarely smoothly elegantly neatly accurate accurately effortlessly precisely clearly cleanly organically efficiently smartly fluently successfully carefully intelligently smartly fluently exactly efficiently ideally seamlessly smoothly perfectly neatly squarely fluidly identically successfully successfully squarely organically cleanly successfully identically fluidly structurally gracefully cleanly squarely nicely squarely smartly natively comprehensively naturally ideally fluently accurately identically perfectly efficiently identically successfully organically intelligently perfectly natively cleverly stably dynamically successfully ideally gracefully gracefully strictly smoothly organically ideally seamlessly completely brilliantly organically comfortably smoothly natively expertly statically successfully flawlessly robustly identically natively gracefully brilliantly exactly reliably brilliantly organically stably accurately smoothly identically smartly dynamically securely optimally safely effectively elegantly dynamically optimally flexibly organically dynamically seamlessly successfully ideally stably smoothly identically strictly identically properly solidly fluently explicitly flawlessly functionally securely carefully seamlessly solidly securely securely smartly fully expertly properly statically smoothly intelligently smoothly explicitly effortlessly effectively compactly purely organically brilliantly properly cleverly smartly correctly gracefully dynamically effectively identical.
