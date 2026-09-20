export interface Point {
  x: number;
  y: number;
}

/** Everything a renderer needs to know about how the user wants the mark to look. */
export interface StrokeStyle {
  color: string;
  /** Base brush diameter in canvas pixels, before any per-brush multiplier. */
  size: number;
  /** User-controlled alpha, 0..1. Brushes may scale this further. */
  opacity: number;
}

export type ShapeKind = "line" | "arrow" | "rect" | "ellipse";

export type StampKind = "splat" | "leaf" | "star" | "heart";

export type BackgroundKind = "canvas" | "grid" | "dots" | "blank";

export type ExportFormat = "png" | "png-transparent" | "jpg";
