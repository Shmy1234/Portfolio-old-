import { BackgroundKind } from "./types";

export const PAPER_COLOR = "#F5F0E6";

export const BACKGROUND_LABELS: Record<BackgroundKind, string> = {
  canvas: "Canvas",
  grid: "Grid",
  dots: "Dots",
  blank: "Blank",
};

const GRID_SPACING = 28;
const DOT_SPACING = 24;

/**
 * Paints the paper layer. This sits below the art layer and is never part
 * of the undo history, so switching paper never costs the user their work.
 */
export function paintBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  kind: BackgroundKind
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(0, 0, width, height);

  switch (kind) {
    case "canvas": {
      // Speckle that reads as canvas tooth at a glance.
      const speckles = Math.round((width * height) / 260);
      for (let i = 0; i < speckles; i++) {
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.025})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }
      break;
    }
    case "grid": {
      ctx.strokeStyle = "rgba(30, 58, 95, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = GRID_SPACING; x < width; x += GRID_SPACING) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = GRID_SPACING; y < height; y += GRID_SPACING) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();
      break;
    }
    case "dots": {
      ctx.fillStyle = "rgba(30, 58, 95, 0.22)";
      for (let x = DOT_SPACING; x < width; x += DOT_SPACING) {
        for (let y = DOT_SPACING; y < height; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
    case "blank":
      break;
  }
}
