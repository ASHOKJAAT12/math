# Numerical Methods Analyzer
**An Interactive Platform for Solving, Visualizing, and Comparing Numerical Methods**

## 1. Introduction
Numerical methods are essential tools in computational mathematics, engineering, and computer science. However, analyzing intermediate algorithmic steps dynamically poses a challenge for traditional theoretical studies. The Numerical Methods Analyzer (NMA) is an interactive, browser-based ecosystem that implements these mathematical engines natively, allowing users to trace computations, inspect absolute/relative error convergence, and visualize boundaries.

## 2. Problem Statement
Students often study numerical methods theoretically but have limited opportunity to:
* Execute algorithms interactively.
* Inspect intermediate iterations.
* Compare multiple numerical methods side-by-side.
* Visualize convergence organically over graphs.
* Study numerical residual error practically.
* Understand the effect of parameters such as tolerance, integration interval (n), and step size (h).

## 3. Objectives
* Implement robust numerical algorithms natively inside JavaScript.
* Visualize numerical convergence and function graphs.
* Compare methods through unified analytical dashboards.
* Analyze absolute, relative, and percentage error at each iteration.
* Provide an ad-free, accessible, educational computational tool.

## 4. Proposed System
NMA provides a comprehensive React-based Single-Page Application (SPA) implementing mathematical calculation, validation, interactive charting, error analysis, and history execution features seamlessly entirely on the frontend. 

## 5. System Architecture
```text
User
 ↓
React UI (Form Inputs)
 ↓
Input Validation Module
 ↓
Numerical Method Engine (Algorithms)
 ↓
Structured Result (Iteration steps, Derivatives, Area bounds)
 ↓
Error / Performance Analysis
 ↓
Charts / Method Comparison
 ↓
History Storage / JSON-CSV Export / Report Output
```

## 6. Technology Stack
* **Frontend UI**: React, JavaScript (ES6+).
* **Build System**: Vite.
* **Styling**: Tailwind CSS.
* **Routing**: React Router.
* **Visualization**: Recharts.
* **Mathematical Parsing**: expr-eval.

## 7. Numerical Methods
### Root Finding
* **Bisection**: Sign-changing bracket approach.
* **Regula Falsi**: Bracket approach utilizing secant line intercepts.
* **Newton-Raphson**: Open method requiring initial guess & exact analytical derivative.
* **Secant**: Open method scaling upon finite differences across two guesses.

### Numerical Integration
* **Trapezoidal Rule**: Applies linear area bounds across $(n)$ divisions.
* **Simpson's 1/3 Rule**: Applies quadratic curve fits (requires even $n$).
* **Simpson's 3/8 Rule**: Applies cubic bounding curves (requires $n$ divisible by 3).

### Numerical Differentiation
* **Forward Difference**: Probes $f(x+h)$.
* **Backward Difference**: Probes $f(x-h)$.
* **Central Difference**: Probes bounds symmetrically $f(x+h) - f(x-h)$.

## 8. Methodology
```text
Problem Definition
↓
Text Input Parsing & Mathematical AST Binding
↓
Sanitation Validation
↓
Numerical Iteration Engine
↓
Metrics Output Generation (Time, Residuals)
↓
Chart Render Evaluation
↓
Result History Caching
```

## 9. Implementation
The system ensures that expression parsing is isolated dynamically avoiding JS `eval()`. Instead, `expr-eval` safely converts algebraic strings (like `x^3 - x - 2`) strictly into executable Abstract Syntax Trees cleanly. 

## 10. User Interface
Features unified modular Tailwind layouts embedding accessible Aria-standards. Dedicated modules for Root Finding, Integration, and Differentiation separate logical execution states cleanly.

## 11. Error Analysis
* **Absolute Error ($E_a$)**: $|exact - approximate|$
* **Relative Error ($E_r$)**: $\frac{|exact - approximate|}{|exact|}$
* **Percentage Error ($E_p$)**: $E_r \times 100$

Residual evaluation tracks $f(x) \approx 0$ at the specified approximation limit. 

## 12. Performance Analysis
* **Iteration count**: Useful strictly for iterative root-finding comparisons.
* **Execution time**: Measured computational logic boundaries strictly internally within `performance.now()`. 
*(Note: Execution time depends on browser context and hardware state natively)*

## 13. Testing
* **Unit Testing**: Over 52 explicit unit-tests executed natively tracking input bounds.
* **Integration Testing**: View interactions and context hooks tested accurately.
* **Validation Testing**: Incorrect algorithmic boundaries logically return safe UX error prompts smartly.
* **Responsive Layouts**: Scaled accurately matching breakpoints logically.

## 14. Results
The NMA correctly predicts numerical matrices natively resolving `x^3 - x - 2` seamlessly across all 4 root methods, properly converging at bounds `~1.5213`. Simpson integrations match analytical constants directly.

## 15. Limitations
* Supported expressions rely directly on `expr-eval` AST parsing capability.
* Floating-point JS arithmetic (`Number.MAX_SAFE_INTEGER`).
* Exact analytical error tracking necessitates knowing the theoretical reference value statically.

## 16. Future Scope
* Adaptive numerical integrations dynamically sizing intervals recursively.
* Expansion of higher order finite differences intelligently.

## 17. Conclusion
The NMA demonstrates that numerical algorithms can be visually modeled entirely inside an interactive software interface dynamically. 

## References
1. Chapra, S. C., & Canale, R. P. (2015). Numerical Methods for Engineers.
2. Burden, R. L., & Faires, J. D. (2010). Numerical Analysis.
