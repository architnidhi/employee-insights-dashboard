# Employee Insights Dashboard

## Intentional Bug Documentation
**Bug Type**: Stale Closure in Virtualization Scroll Handler
**Location**: In the virtualization logic, the scroll event handler captures an outdated reference to the row height state.
**Why this bug**: This creates a subtle offset calculation error when the viewport is resized, demonstrating a common React performance pitfall.

## Virtualization Math Explanation
The virtualization calculates visible rows using:
- Viewport height / row height = visible rows count
- ScrollTop / row height = start index
- Buffer = 5 rows above and below
- Only renders rows from max(0, start - buffer) to min(total, end + buffer)
