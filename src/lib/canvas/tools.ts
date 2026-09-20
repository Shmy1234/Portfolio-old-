import {
  Pen,
  Highlighter,
  Eraser,
  Minus,
  ArrowUpRight,
  Square,
  Circle,
  PaintBucket,
  Pipette,
  Type,
  Sparkles,
  SprayCan,
  Paintbrush,
  Feather,
  LucideIcon,
} from "lucide-react";
import { BrushId } from "./brushes";
import { ShapeKind } from "./types";

export type ToolId =
  | BrushId
  | ShapeKind
  | "fill"
  | "eyedropper"
  | "text"
  | "stamp";

/**
 * How the engine should interpret pointer events for a tool.
 * - freehand: continuous strokes committed on pointer-up
 * - shape:    drag to preview, commit on release
 * - click:    single-shot action at the press point
 */
export type ToolKind = "freehand" | "shape" | "click";

export interface ToolDefinition {
  id: ToolId;
  label: string;
  icon: LucideIcon;
  kind: ToolKind;
  /** Single-key shortcut, lowercase. */
  shortcut: string;
  /** Tools that ignore the colour swatches. */
  usesColor: boolean;
  group: "draw" | "shape" | "utility";
}

export const TOOLS: ToolDefinition[] = [
  { id: "pen", label: "Pen", icon: Pen, kind: "freehand", shortcut: "b", usesColor: true, group: "draw" },
  { id: "marker", label: "Marker", icon: Paintbrush, kind: "freehand", shortcut: "m", usesColor: true, group: "draw" },
  { id: "highlighter", label: "Highlighter", icon: Highlighter, kind: "freehand", shortcut: "h", usesColor: true, group: "draw" },
  { id: "airbrush", label: "Airbrush", icon: SprayCan, kind: "freehand", shortcut: "a", usesColor: true, group: "draw" },
  { id: "calligraphy", label: "Calligraphy", icon: Feather, kind: "freehand", shortcut: "c", usesColor: true, group: "draw" },
  { id: "eraser", label: "Eraser", icon: Eraser, kind: "freehand", shortcut: "e", usesColor: false, group: "draw" },

  { id: "line", label: "Line", icon: Minus, kind: "shape", shortcut: "l", usesColor: true, group: "shape" },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight, kind: "shape", shortcut: "r", usesColor: true, group: "shape" },
  { id: "rect", label: "Rectangle", icon: Square, kind: "shape", shortcut: "u", usesColor: true, group: "shape" },
  { id: "ellipse", label: "Ellipse", icon: Circle, kind: "shape", shortcut: "o", usesColor: true, group: "shape" },

  { id: "fill", label: "Fill", icon: PaintBucket, kind: "click", shortcut: "g", usesColor: true, group: "utility" },
  { id: "eyedropper", label: "Eyedropper", icon: Pipette, kind: "click", shortcut: "i", usesColor: false, group: "utility" },
  { id: "text", label: "Text", icon: Type, kind: "click", shortcut: "t", usesColor: true, group: "utility" },
  { id: "stamp", label: "Stamp", icon: Sparkles, kind: "click", shortcut: "s", usesColor: true, group: "utility" },
];

const BY_ID = new Map(TOOLS.map((tool) => [tool.id, tool]));

export function getTool(id: ToolId): ToolDefinition {
  const tool = BY_ID.get(id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}

export function toolForShortcut(key: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.shortcut === key.toLowerCase());
}

const BRUSH_IDS: ToolId[] = ["pen", "marker", "highlighter", "airbrush", "calligraphy", "eraser"];
const SHAPE_IDS: ToolId[] = ["line", "arrow", "rect", "ellipse"];

export function isBrush(id: ToolId): id is BrushId {
  return BRUSH_IDS.includes(id);
}

export function isShape(id: ToolId): id is ShapeKind {
  return SHAPE_IDS.includes(id);
}

export const COLORS = [
  "#1E3A5F", "#4A7C7C", "#A0522D", "#DAA520", "#2E4A2E",
  "#8B4513", "#4169E1", "#DC143C", "#FFD700", "#FFFFFF", "#000000",
];
