import { Point } from "./types";

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Accepts #rgb, #rrggbb, and #rrggbbaa. */
export function parseColor(color: string): Rgba {
  let hex = color.trim().replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(hex.slice(0, 6), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
    a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255,
  };
}

function colorAt(data: Uint8ClampedArray, offset: number): Rgba {
  return {
    r: data[offset],
    g: data[offset + 1],
    b: data[offset + 2],
    a: data[offset + 3],
  };
}

/**
 * Squared euclidean distance in RGBA space. Comparing squares avoids a
 * sqrt per pixel, which matters across a few hundred thousand of them.
 */
function withinTolerance(
  data: Uint8ClampedArray,
  offset: number,
  target: Rgba,
  toleranceSq: number
): boolean {
  const dr = data[offset] - target.r;
  const dg = data[offset + 1] - target.g;
  const db = data[offset + 2] - target.b;
  const da = data[offset + 3] - target.a;
  return dr * dr + dg * dg + db * db + da * da <= toleranceSq;
}

/**
 * Scanline flood fill. Walks each row to its horizontal extents, then
 * queues the rows above and below — far fewer stack pushes than a
 * naive four-way flood, which matters on large empty regions.
 *
 * @param tolerance 0-100, how different a pixel may be and still be filled.
 * @returns true if anything changed.
 */
export function floodFill(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  start: Point,
  fillColor: string,
  tolerance: number,
  opacity: number
): boolean {
  const startX = Math.floor(start.x);
  const startY = Math.floor(start.y);
  if (startX < 0 || startY < 0 || startX >= width || startY >= height) {
    return false;
  }

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const target = colorAt(data, (startY * width + startX) * 4);
  const fill = parseColor(fillColor);
  fill.a = Math.round(255 * opacity);

  // A per-channel tolerance of t allows a squared distance of 4t².
  const scaled = (tolerance / 100) * 255;
  const toleranceSq = 4 * scaled * scaled;

  const sameAsTarget =
    target.r === fill.r &&
    target.g === fill.g &&
    target.b === fill.b &&
    target.a === fill.a;
  if (sameAsTarget) return false;

  const visited = new Uint8Array(width * height);
  const stack: number[] = [startX, startY];
  let changed = false;

  while (stack.length > 0) {
    const y = stack.pop()!;
    const x = stack.pop()!;
    const rowStart = y * width;

    if (visited[rowStart + x]) continue;

    // Walk left and right to the edges of this span.
    let left = x;
    while (left > 0 && withinTolerance(data, (rowStart + left - 1) * 4, target, toleranceSq)) {
      left--;
    }
    let right = x;
    while (
      right < width - 1 &&
      withinTolerance(data, (rowStart + right + 1) * 4, target, toleranceSq)
    ) {
      right++;
    }

    for (let i = left; i <= right; i++) {
      const index = rowStart + i;
      if (visited[index]) continue;
      visited[index] = 1;

      const offset = index * 4;
      data[offset] = fill.r;
      data[offset + 1] = fill.g;
      data[offset + 2] = fill.b;
      data[offset + 3] = fill.a;
      changed = true;

      // Queue the neighbouring rows for the span we just filled.
      if (y > 0) {
        const above = (y - 1) * width + i;
        if (!visited[above] && withinTolerance(data, above * 4, target, toleranceSq)) {
          stack.push(i, y - 1);
        }
      }
      if (y < height - 1) {
        const below = (y + 1) * width + i;
        if (!visited[below] && withinTolerance(data, below * 4, target, toleranceSq)) {
          stack.push(i, y + 1);
        }
      }
    }
  }

  if (changed) ctx.putImageData(image, 0, 0);
  return changed;
}

/** Reads a pixel and returns it as #rrggbb, or null if fully transparent. */
export function pickColor(
  ctx: CanvasRenderingContext2D,
  point: Point
): string | null {
  const { data } = ctx.getImageData(
    Math.floor(point.x),
    Math.floor(point.y),
    1,
    1
  );
  if (data[3] === 0) return null;
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(data[0])}${toHex(data[1])}${toHex(data[2])}`;
}
