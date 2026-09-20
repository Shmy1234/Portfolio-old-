import { Point, ShapeKind, StrokeStyle } from "./types";

export interface ShapeOptions {
  filled: boolean;
  /** Shift-drag: square, circle, or 45°-snapped line. */
  constrain: boolean;
}

/**
 * Snap `to` relative to `from` so squares stay square and lines stay
 * on a 45° grid while Shift is held.
 */
function applyConstraint(
  kind: ShapeKind,
  from: Point,
  to: Point,
  constrain: boolean
): Point {
  if (!constrain) return to;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (kind === "line" || kind === "arrow") {
    const angle = Math.atan2(dy, dx);
    const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    const length = Math.hypot(dx, dy);
    return {
      x: from.x + Math.cos(snapped) * length,
      y: from.y + Math.sin(snapped) * length,
    };
  }

  // Rectangles and ellipses lock to the larger axis, preserving direction.
  const side = Math.max(Math.abs(dx), Math.abs(dy));
  return {
    x: from.x + Math.sign(dx || 1) * side,
    y: from.y + Math.sign(dy || 1) * side,
  };
}

const ARROW_HEAD_RATIO = 3.2;
const ARROW_HEAD_MIN = 10;

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const head = Math.max(ARROW_HEAD_MIN, size * ARROW_HEAD_RATIO);
  const spread = Math.PI / 7;

  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - Math.cos(angle - spread) * head,
    to.y - Math.sin(angle - spread) * head
  );
  ctx.lineTo(
    to.x - Math.cos(angle + spread) * head,
    to.y - Math.sin(angle + spread) * head
  );
  ctx.closePath();
  ctx.fill();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  origin: Point,
  cursor: Point,
  style: StrokeStyle,
  options: ShapeOptions
): void {
  const to = applyConstraint(kind, origin, cursor, options.constrain);

  ctx.save();
  ctx.globalAlpha = style.opacity;
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.color;
  ctx.lineWidth = Math.max(1, style.size);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (kind) {
    case "line": {
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      break;
    }
    case "arrow": {
      // Stop the shaft short of the tip so the head has a clean point.
      const angle = Math.atan2(to.y - origin.y, to.x - origin.x);
      const head = Math.max(ARROW_HEAD_MIN, style.size * ARROW_HEAD_RATIO);
      const shaftEnd = {
        x: to.x - Math.cos(angle) * head * 0.6,
        y: to.y - Math.sin(angle) * head * 0.6,
      };
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(shaftEnd.x, shaftEnd.y);
      ctx.stroke();
      drawArrowHead(ctx, origin, to, style.size);
      break;
    }
    case "rect": {
      const x = Math.min(origin.x, to.x);
      const y = Math.min(origin.y, to.y);
      const w = Math.abs(to.x - origin.x);
      const h = Math.abs(to.y - origin.y);
      if (options.filled) ctx.fillRect(x, y, w, h);
      else ctx.strokeRect(x, y, w, h);
      break;
    }
    case "ellipse": {
      const cx = (origin.x + to.x) / 2;
      const cy = (origin.y + to.y) / 2;
      const rx = Math.abs(to.x - origin.x) / 2;
      const ry = Math.abs(to.y - origin.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (options.filled) ctx.fill();
      else ctx.stroke();
      break;
    }
  }

  ctx.restore();
}
