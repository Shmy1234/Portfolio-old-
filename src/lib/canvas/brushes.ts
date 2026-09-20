import { Point, StrokeStyle } from "./types";

export interface SegmentArgs {
  ctx: CanvasRenderingContext2D;
  from: Point;
  to: Point;
  style: StrokeStyle;
  /** Pointer speed in canvas px per millisecond, used for taper. */
  speed: number;
}

export interface CompositeStroke {
  /** Final alpha for the whole stroke, derived from the user's opacity. */
  alpha: (opacity: number) => number;
  mode: GlobalCompositeOperation;
}

export interface Brush {
  /** Draw the connecting mark between two sampled pointer positions. */
  segment(args: SegmentArgs): void;
  /** Draw the initial mark laid down on pointer-down. */
  dot(ctx: CanvasRenderingContext2D, point: Point, style: StrokeStyle): void;
  /**
   * True when the brush should keep emitting while the pointer is held
   * still (airbrush). The engine drives this with an animation frame loop.
   */
  continuous?: boolean;
  /**
   * Translucent brushes must not apply their alpha per segment — overlapping
   * samples would stack and band the stroke. When this is set the engine
   * renders the stroke opaque on the scratch layer and composites it down
   * exactly once on release, giving an even wash.
   */
  compositeStroke?: CompositeStroke;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Fast strokes thin out, the way a real nib lifts off the page.
 * Returns a multiplier on the brush diameter.
 */
function taperFor(speed: number): number {
  return clamp(1 - speed * 0.28, 0.45, 1);
}

function strokeLine(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  width: number,
  cap: CanvasLineCap
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.lineWidth = Math.max(0.5, width);
  ctx.lineCap = cap;
  ctx.lineJoin = "round";
  ctx.stroke();
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  point: Point,
  diameter: number
) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, Math.max(0.25, diameter / 2), 0, Math.PI * 2);
  ctx.fill();
}

const pen: Brush = {
  segment({ ctx, from, to, style, speed }) {
    ctx.save();
    ctx.globalAlpha = style.opacity;
    ctx.strokeStyle = style.color;
    strokeLine(ctx, from, to, style.size * taperFor(speed), "round");
    ctx.restore();
  },
  dot(ctx, point, style) {
    ctx.save();
    ctx.globalAlpha = style.opacity;
    ctx.fillStyle = style.color;
    fillCircle(ctx, point, style.size);
    ctx.restore();
  },
};

const marker: Brush = {
  // Rendered opaque, then washed down once on release.
  compositeStroke: { alpha: (opacity) => opacity * 0.55, mode: "source-over" },
  segment({ ctx, from, to, style }) {
    ctx.save();
    ctx.strokeStyle = style.color;
    strokeLine(ctx, from, to, style.size * 1.6, "round");
    ctx.restore();
  },
  dot(ctx, point, style) {
    ctx.save();
    ctx.fillStyle = style.color;
    fillCircle(ctx, point, style.size * 1.6);
    ctx.restore();
  },
};

const highlighter: Brush = {
  compositeStroke: { alpha: (opacity) => opacity * 0.45, mode: "multiply" },
  segment({ ctx, from, to, style }) {
    ctx.save();
    ctx.strokeStyle = style.color;
    // Flat, wide, and untapered — a chisel tip does not lift.
    strokeLine(ctx, from, to, style.size * 2.4, "square");
    ctx.restore();
  },
  dot(ctx, point, style) {
    ctx.save();
    ctx.fillStyle = style.color;
    const w = style.size * 2.4;
    ctx.fillRect(point.x - w / 2, point.y - w / 2, w, w);
    ctx.restore();
  },
};

/** Scatter density scales with area so big airbrushes do not look sparse. */
function spray(
  ctx: CanvasRenderingContext2D,
  point: Point,
  style: StrokeStyle
) {
  const radius = style.size * 1.5;
  const count = Math.max(6, Math.round(radius * 1.6));

  ctx.save();
  ctx.fillStyle = style.color;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    // sqrt keeps the scatter even instead of clumping at the centre
    const distance = Math.sqrt(Math.random()) * radius;
    const x = point.x + Math.cos(angle) * distance;
    const y = point.y + Math.sin(angle) * distance;
    // Fade toward the edge of the cone.
    ctx.globalAlpha = style.opacity * 0.18 * (1 - distance / radius);
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 1.1 + 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

const airbrush: Brush = {
  continuous: true,
  segment({ ctx, from, to, style }) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy);
    // Interpolate so quick drags stay a continuous cone, not dashes.
    const steps = Math.max(1, Math.ceil(distance / (style.size * 0.4)));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      spray(ctx, { x: from.x + dx * t, y: from.y + dy * t }, style);
    }
  },
  dot(ctx, point, style) {
    spray(ctx, point, style);
  },
};

/** Fixed nib angle, in radians. Thickness falls out of the stroke direction. */
const NIB_ANGLE = -Math.PI / 4;

const calligraphy: Brush = {
  segment({ ctx, from, to, style }) {
    const half = style.size * 0.75;
    const nx = Math.cos(NIB_ANGLE) * half;
    const ny = Math.sin(NIB_ANGLE) * half;

    ctx.save();
    ctx.globalAlpha = style.opacity;
    ctx.fillStyle = style.color;
    ctx.beginPath();
    ctx.moveTo(from.x + nx, from.y + ny);
    ctx.lineTo(to.x + nx, to.y + ny);
    ctx.lineTo(to.x - nx, to.y - ny);
    ctx.lineTo(from.x - nx, from.y - ny);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
  dot(ctx, point, style) {
    const half = style.size * 0.75;
    ctx.save();
    ctx.globalAlpha = style.opacity;
    ctx.fillStyle = style.color;
    ctx.beginPath();
    ctx.moveTo(
      point.x + Math.cos(NIB_ANGLE) * half,
      point.y + Math.sin(NIB_ANGLE) * half
    );
    ctx.lineTo(
      point.x - Math.cos(NIB_ANGLE) * half,
      point.y - Math.sin(NIB_ANGLE) * half
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = style.color;
    ctx.stroke();
    ctx.restore();
  },
};

/**
 * The eraser punches holes in the art layer rather than painting the
 * background colour, so the paper underneath shows through unchanged.
 */
const eraser: Brush = {
  segment({ ctx, from, to, style }) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#000";
    strokeLine(ctx, from, to, style.size * 2, "round");
    ctx.restore();
  },
  dot(ctx, point, style) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    fillCircle(ctx, point, style.size * 2);
    ctx.restore();
  },
};

export const brushes = {
  pen,
  marker,
  highlighter,
  airbrush,
  calligraphy,
  eraser,
} satisfies Record<string, Brush>;

export type BrushId = keyof typeof brushes;

/** Visual diameter of a brush, used to size the on-canvas cursor ring. */
export function brushDiameter(id: BrushId, size: number): number {
  switch (id) {
    case "eraser":
      return size * 2;
    case "highlighter":
      return size * 2.4;
    case "marker":
      return size * 1.6;
    case "airbrush":
      return size * 3;
    default:
      return size;
  }
}
