import { Point, StampKind, StrokeStyle } from "./types";

export const STAMP_LABELS: Record<StampKind, string> = {
  splat: "Paint splat",
  leaf: "Leaf",
  star: "Star",
  heart: "Heart",
};

function drawSplat(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number
) {
  // Irregular blob plus a few flung droplets. Control points sit *outside*
  // the rim so the edge bulges between lobes instead of pinching into spikes.
  const lobes = 9;
  const radiusAt = (i: number) => radius * (0.78 + Math.sin(i * 2.7) * 0.22);

  ctx.beginPath();
  for (let i = 0; i <= lobes; i++) {
    const angle = (i / lobes) * Math.PI * 2;
    const x = point.x + Math.cos(angle) * radiusAt(i);
    const y = point.y + Math.sin(angle) * radiusAt(i);

    if (i === 0) {
      ctx.moveTo(x, y);
      continue;
    }
    const midAngle = angle - Math.PI / lobes;
    const bulge = ((radiusAt(i) + radiusAt(i - 1)) / 2) * 1.25;
    ctx.quadraticCurveTo(
      point.x + Math.cos(midAngle) * bulge,
      point.y + Math.sin(midAngle) * bulge,
      x,
      y
    );
  }
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + 0.4;
    const distance = radius * (1.2 + (i % 3) * 0.35);
    ctx.beginPath();
    ctx.arc(
      point.x + Math.cos(angle) * distance,
      point.y + Math.sin(angle) * distance,
      radius * (0.1 + (i % 2) * 0.07),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius);
  ctx.quadraticCurveTo(point.x + radius, point.y, point.x, point.y + radius);
  ctx.quadraticCurveTo(point.x - radius, point.y, point.x, point.y - radius);
  ctx.closePath();
  ctx.fill();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number
) {
  const points = 5;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.42;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = point.x + Math.cos(angle) * r;
    const y = point.y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  point: Point,
  radius: number
) {
  const top = point.y - radius * 0.35;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y + radius * 0.75);
  ctx.bezierCurveTo(
    point.x - radius * 1.5, top - radius * 0.6,
    point.x - radius * 0.35, top - radius * 1.1,
    point.x, top
  );
  ctx.bezierCurveTo(
    point.x + radius * 0.35, top - radius * 1.1,
    point.x + radius * 1.5, top - radius * 0.6,
    point.x, point.y + radius * 0.75
  );
  ctx.closePath();
  ctx.fill();
}

export function drawStamp(
  ctx: CanvasRenderingContext2D,
  kind: StampKind,
  point: Point,
  style: StrokeStyle
): void {
  const radius = Math.max(8, style.size * 2.2);

  ctx.save();
  ctx.globalAlpha = style.opacity;
  ctx.fillStyle = style.color;

  switch (kind) {
    case "splat":
      drawSplat(ctx, point, radius);
      break;
    case "leaf":
      drawLeaf(ctx, point, radius);
      break;
    case "star":
      drawStar(ctx, point, radius);
      break;
    case "heart":
      drawHeart(ctx, point, radius);
      break;
  }

  ctx.restore();
}
