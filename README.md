# Employee Insights Dashboard

## Intentional Bug Documentation
**Bug Type**: Stale Closure in Virtualization Scroll Handler  
**Location**: In `VirtualizedList.tsx`, the scroll event handler captures an outdated reference to the row height state.  
**Why this bug**: This creates a subtle offset calculation error when the viewport is resized, demonstrating a common React performance pitfall.

## Virtualization Math Explanation
The virtualization calculates visible rows using:
- Viewport height / row height = visible rows count
- ScrollTop / row height = start index
- Buffer = 5 rows above and below
- Only renders rows from max(0, start - buffer) to min(total, end + buffer)

## Image Merging Logic
The photo and signature are merged using HTML5 Canvas:
1. User captures photo via Webcam component
2. Signature is drawn on an overlay canvas
3. When merging, a new canvas context draws the photo first, then the existing signature strokes are preserved
4. Final image is exported as dataURL using `canvas.toDataURL('image/png')`

## Scroll Offset Calculation
```typescript
const start = Math.floor(scrollTop / rowHeight);
const end = Math.min(
  data.length - 1,
  Math.floor((scrollTop + clientHeight) / rowHeight)
);
```
The offsetY is calculated as `visibleRange.start * rowHeight` to position the visible rows correctly.
