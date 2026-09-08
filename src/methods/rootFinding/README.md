# Root Finding Mathematical Engine

## Overview
This module isolates numerical root-finding algorithms. It acts as the mathematical backend for the platform, ensuring zero coupling with the UI. Evaluator systems securely parse incoming strings mathematically avoiding unsafe JS evaluation mechanisms.

### Why iterations vs execution time?
**Iteration Count** correlates strictly with theoretical properties of an algorithm's convergence rate (e.g. bisection is O(N) or linear, Newton is quadratic). However, **execution time** depends on processing overhead—an algorithm executing an expensive derivative formula on every iteration may take more milliseconds than a simpler method, even if it requires fewer iterations. These algorithms log structured intermediate matrices to analyze this discrepancy later.

---

## Algorithms

### 1. Bisection Method
* **Formula:** `c = (a + b) / 2`
* **Requirements:** Two initial boundaries `[-a, b]` clamping an actual root (detected when `f(a) · f(b) < 0`).
* **Stopping condition:** When `|f(c)| < tolerance` or interval width `/ 2 < tolerance`.
* **Advantages:** Absolute guaranteed linear convergence. Unbeatable stability.
* **Limitations:** Extremely slow. 

### 2. Regula Falsi (False Position)
* **Formula:** `c = (a*f(b) - b*f(a)) / (f(b) - f(a))`
* **Requirements:** Same bounding condition as Bisection `[f(a) * f(b) < 0]`.
* **Stopping condition:** Same accuracy tolerance `|f(c)|`.
* **Advantages:** Normally cuts down iterations sharply by assuming a linear correlation toward the axis.
* **Limitations:** Prone to stagnation at one boundary when handling heavily bowed (convex/concave) curves, resulting in immense iteration counts bypassing Newton-like speeds.

### 3. Newton-Raphson
* **Formula:** `x_{n+1} = x_n - f(x_n)/f'(x_n)`
* **Requirements:** Requires a single initial guess `x0` and the corresponding derivative of the function `f'(x)`. (We provide a finite-differences fallback implicitly if an exact callback isn't supplied).
* **Stopping condition:** Evaluates `f(x) < tol` or distance to previous approximation `< tol`.
* **Advantages:** Blisteringly fast quadratic convergence when initialized close to the root.
* **Limitations:** Highly volatile; diverges easily tracking wild tangent trails or fails outright if tracking toward an extremum `f'(x) = 0`. Not guaranteed to converge.

### 4. Secant Method
* **Formula:** `x_{n+1} = x_n - f(x_n) [ (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1})) ]`
* **Requirements:** Transformed Newton mechanism avoiding an explicit derivative. Requires two completely distinct initial guesses closely trailing each other.
* **Stopping condition:** Follows standard accuracy conditions.
* **Advantages:** Usually matches Newton's dramatic speeds (technically 1.618 super-linear speed) without agonizing over analytical derivatives.
* **Limitations:** Cannot guarantee convergence; fails if consecutive `f(x)` converge causing divided-by-zero denominator blowups.
