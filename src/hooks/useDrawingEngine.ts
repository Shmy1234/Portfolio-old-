"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brushes, brushDiameter, BrushId } from "@/lib/canvas/brushes";
import { paintBackground } from "@/lib/canvas/backgrounds";
import { floodFill, pickColor } from "@/lib/canvas/fill";
import { HistoryStack } from "@/lib/canvas/history";
import { drawShape } from "@/lib/canvas/shapes";
import { drawStamp } from "@/lib/canvas/stamps";
import {
  copyCanvasToClipboard,
  downloadCanvas,
  drawImageFitted,
  imageFromDataTransfer,
  loadImageFile,
} from "@/lib/canvas/imageIO";
import {
  COLORS,
  getTool,
  isBrush,
  isShape,
  toolForShortcut,
  ToolId,
} from "@/lib/canvas/tools";
import {
  BackgroundKind,
  ExportFormat,
  Point,
  StampKind,
  StrokeStyle,
} from "@/lib/canvas/types";

const MAX_DPR = 2;
const MAX_RECENT_COLORS = 8;
const MIN_SIZE = 2;
const MAX_SIZE = 60;

/**
 * The first getContext call fixes a canvas's attributes for its lifetime, so
 * every lookup must request the same options. These layers are read back on
 * each snapshot, flood fill and colour pick, which is exactly the case
 * willReadFrequently exists for.
 */
function get2d(canvas: HTMLCanvasElement | null): CanvasRenderingContext2D | null {
  return canvas?.getContext("2d", { willReadFrequently: true }) ?? null;
}

interface TextDraft {
  /** CSS pixels, for positioning the overlay input. */
  x: number;
  y: number;
  value: string;
}

export interface DrawingEngine {
  containerRef: React.RefObject<HTMLDivElement>;
  backgroundRef: React.RefObject<HTMLCanvasElement>;
  artRef: React.RefObject<HTMLCanvasElement>;
  previewRef: React.RefObject<HTMLCanvasElement>;

  tool: ToolId;
  setTool: (tool: ToolId) => void;
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  filled: boolean;
  setFilled: (filled: boolean) => void;
  tolerance: number;
  setTolerance: (tolerance: number) => void;
  stamp: StampKind;
  setStamp: (stamp: StampKind) => void;
  background: BackgroundKind;
  setBackground: (background: BackgroundKind) => void;
  recentColors: string[];

  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clear: () => void;

  cursor: Point | null;
  cursorDiameter: number;
  textDraft: TextDraft | null;
  updateTextDraft: (value: string) => void;
  commitText: () => void;
  cancelText: () => void;

  isDragging: boolean;
  status: string | null;

  handlePointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  handlePointerLeave: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;

  importImage: (file: File) => void;
  exportImage: (format: ExportFormat) => void;
  copyImage: () => void;
}

export function useDrawingEngine(): DrawingEngine {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const history = useRef(new HistoryStack());
  const dpr = useRef(1);

  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const lastTime = useRef(0);
  const shapeOrigin = useRef<Point | null>(null);
  const shiftHeld = useRef(false);
  const sprayFrame = useRef<number | null>(null);
  /** Translucent brushes accumulate on the preview layer before compositing. */
  const strokeOnScratch = useRef(false);

  const [tool, setToolState] = useState<ToolId>("pen");
  const [color, setColorState] = useState(COLORS[0]);
  const [size, setSizeState] = useState(8);
  const [opacity, setOpacity] = useState(1);
  const [filled, setFilled] = useState(false);
  const [tolerance, setTolerance] = useState(24);
  const [stamp, setStamp] = useState<StampKind>("splat");
  const [background, setBackgroundState] = useState<BackgroundKind>("canvas");
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [textDraft, setTextDraft] = useState<TextDraft | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Latest settings, readable from event handlers without re-binding them.
  const settings = useRef({ tool, color, size, opacity, filled, tolerance, stamp });
  settings.current = { tool, color, size, opacity, filled, tolerance, stamp };

  const flash = useCallback((message: string) => {
    setStatus(message);
    window.setTimeout(() => setStatus((current) => (current === message ? null : current)), 2600);
  }, []);

  const styleOf = useCallback(
    (): StrokeStyle => ({
      color: settings.current.color,
      size: settings.current.size,
      opacity: settings.current.opacity,
    }),
    []
  );

  const ctxOf = (ref: React.RefObject<HTMLCanvasElement>) => get2d(ref.current);

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(history.current.canUndo());
    setCanRedo(history.current.canRedo());
  }, []);

  const snapshot = useCallback(() => {
    const canvas = artRef.current;
    const ctx = ctxOf(artRef);
    if (!canvas || !ctx) return;
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    syncHistoryFlags();
  }, [syncHistoryFlags]);

  const restore = useCallback((state: ImageData | null) => {
    const ctx = ctxOf(artRef);
    if (!ctx || !state) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(state, 0, 0);
    ctx.restore();
    syncHistoryFlags();
  }, [syncHistoryFlags]);

  /** Sizes all three layers to the container, preserving existing art. */
  const resize = useCallback(
    (seedHistory: boolean) => {
      const container = containerRef.current;
      const art = artRef.current;
      const bg = backgroundRef.current;
      const preview = previewRef.current;
      if (!container || !art || !bg || !preview) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      dpr.current = ratio;

      // Keep a copy of the art before the backing store is resized.
      const previous = document.createElement("canvas");
      previous.width = art.width;
      previous.height = art.height;
      if (art.width > 0) get2d(previous)?.drawImage(art, 0, 0);

      for (const canvas of [bg, art, preview]) {
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        get2d(canvas)?.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      const bgCtx = get2d(bg);
      if (bgCtx) paintBackground(bgCtx, rect.width, rect.height, background);

      const artCtx = get2d(art);
      if (artCtx && previous.width > 0) {
        artCtx.save();
        artCtx.setTransform(1, 0, 0, 1, 0, 0);
        artCtx.drawImage(previous, 0, 0, art.width, art.height);
        artCtx.restore();
      }

      if (seedHistory && artCtx) {
        history.current.reset(artCtx.getImageData(0, 0, art.width, art.height));
        syncHistoryFlags();
      }
    },
    [background, syncHistoryFlags]
  );

  useEffect(() => {
    resize(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => resize(false));
    observer.observe(container);
    return () => observer.disconnect();
  }, [resize]);

  // Repaint the paper whenever the background changes. The art layer is
  // untouched, so switching paper is free and never costs an undo step.
  useEffect(() => {
    const bg = backgroundRef.current;
    const container = containerRef.current;
    const ctx = get2d(bg);
    if (!bg || !container || !ctx) return;
    const rect = container.getBoundingClientRect();
    paintBackground(ctx, rect.width, rect.height, background);
  }, [background]);

  const rememberColor = useCallback((next: string) => {
    setRecentColors((current) => {
      if (COLORS.includes(next)) return current;
      const deduped = [next, ...current.filter((c) => c !== next)];
      return deduped.slice(0, MAX_RECENT_COLORS);
    });
  }, []);

  const setColor = useCallback(
    (next: string) => {
      setColorState(next);
      rememberColor(next);
    },
    [rememberColor]
  );

  const setSize = useCallback((next: number) => {
    setSizeState(Math.round(Math.min(MAX_SIZE, Math.max(MIN_SIZE, next))));
  }, []);

  const setBackground = useCallback((next: BackgroundKind) => {
    setBackgroundState(next);
  }, []);

  const setTool = useCallback((next: ToolId) => {
    setToolState(next);
    setTextDraft(null);
  }, []);

  const pointFrom = useCallback((e: { clientX: number; clientY: number }): Point | null => {
    const canvas = artRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    // CSS pixels — the contexts are pre-scaled by the device pixel ratio.
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width) / dpr.current,
      y: (e.clientY - rect.top) * (canvas.height / rect.height) / dpr.current,
    };
  }, []);

  const clearPreview = useCallback(() => {
    const preview = previewRef.current;
    const ctx = ctxOf(previewRef);
    if (!preview || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, preview.width, preview.height);
    ctx.restore();
  }, []);

  const stopSpray = useCallback(() => {
    if (sprayFrame.current !== null) {
      cancelAnimationFrame(sprayFrame.current);
      sprayFrame.current = null;
    }
  }, []);

  /** Keeps the airbrush emitting while the pointer is held still. */
  const startSpray = useCallback(() => {
    stopSpray();
    const tick = () => {
      const ctx = ctxOf(artRef);
      const point = lastPoint.current;
      if (drawing.current && ctx && point && settings.current.tool === "airbrush") {
        brushes.airbrush.dot(ctx, point, styleOf());
        sprayFrame.current = requestAnimationFrame(tick);
      } else {
        sprayFrame.current = null;
      }
    };
    sprayFrame.current = requestAnimationFrame(tick);
  }, [stopSpray, styleOf]);

  // --- Single-shot tools -------------------------------------------------

  const applyFill = useCallback(
    (point: Point) => {
      const canvas = artRef.current;
      const ctx = ctxOf(artRef);
      if (!canvas || !ctx) return;

      const changed = floodFill(
        ctx,
        canvas.width,
        canvas.height,
        { x: point.x * dpr.current, y: point.y * dpr.current },
        settings.current.color,
        settings.current.tolerance,
        settings.current.opacity
      );
      if (changed) snapshot();
    },
    [snapshot]
  );

  const applyEyedropper = useCallback(
    (point: Point) => {
      const device = { x: point.x * dpr.current, y: point.y * dpr.current };
      const artCtx = ctxOf(artRef);
      const bgCtx = ctxOf(backgroundRef);

      // Prefer the art layer; fall back to the paper where nothing is painted.
      const sampled =
        (artCtx ? pickColor(artCtx, device) : null) ??
        (bgCtx ? pickColor(bgCtx, device) : null);

      if (sampled) {
        setColor(sampled);
        flash(`Picked ${sampled.toUpperCase()}`);
      }
    },
    [setColor, flash]
  );

  const applyStamp = useCallback(
    (point: Point) => {
      const ctx = ctxOf(artRef);
      if (!ctx) return;
      drawStamp(ctx, settings.current.stamp, point, styleOf());
      snapshot();
    },
    [snapshot, styleOf]
  );

  // --- Text --------------------------------------------------------------

  const commitText = useCallback(() => {
    const draft = textDraft;
    const ctx = ctxOf(artRef);
    if (!draft || !ctx) {
      setTextDraft(null);
      return;
    }
    if (draft.value.trim().length > 0) {
      const fontSize = Math.max(14, settings.current.size * 2.5);
      ctx.save();
      ctx.globalAlpha = settings.current.opacity;
      ctx.fillStyle = settings.current.color;
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillText(draft.value, draft.x, draft.y);
      ctx.restore();
      snapshot();
    }
    setTextDraft(null);
  }, [textDraft, snapshot]);

  const cancelText = useCallback(() => setTextDraft(null), []);

  const updateTextDraft = useCallback((value: string) => {
    setTextDraft((current) => (current ? { ...current, value } : current));
  }, []);

  // --- Pointer handling --------------------------------------------------

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      // An open text box commits before anything else happens.
      if (textDraft) {
        commitText();
        return;
      }

      e.preventDefault();
      const point = pointFrom(e);
      if (!point) return;

      // Capture keeps the stroke alive if the pointer leaves the canvas, but
      // browsers throw when the id is no longer active. Drawing still works
      // without it, so a failure here must not abort the stroke.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is an optimisation, not a requirement */
      }
      shiftHeld.current = e.shiftKey;

      const definition = getTool(settings.current.tool);

      if (definition.kind === "click") {
        switch (definition.id) {
          case "fill":
            applyFill(point);
            break;
          case "eyedropper":
            applyEyedropper(point);
            break;
          case "stamp":
            applyStamp(point);
            break;
          case "text":
            setTextDraft({ x: point.x, y: point.y, value: "" });
            break;
        }
        return;
      }

      drawing.current = true;
      lastPoint.current = point;
      lastTime.current = performance.now();

      if (definition.kind === "shape") {
        shapeOrigin.current = point;
        return;
      }

      if (!isBrush(definition.id)) return;
      const brush = brushes[definition.id];
      strokeOnScratch.current = !!brush.compositeStroke;

      const ctx = ctxOf(strokeOnScratch.current ? previewRef : artRef);
      if (ctx) {
        brush.dot(ctx, point, styleOf());
        if (brush.continuous) startSpray();
      }
    },
    [textDraft, commitText, pointFrom, applyFill, applyEyedropper, applyStamp, styleOf, startSpray]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const point = pointFrom(e);
      if (point) setCursor(point);
      if (!drawing.current || !point) return;

      e.preventDefault();
      shiftHeld.current = e.shiftKey;

      const definition = getTool(settings.current.tool);

      if (definition.kind === "shape" && shapeOrigin.current) {
        const ctx = ctxOf(previewRef);
        if (!ctx) return;
        clearPreview();
        drawShape(ctx, definition.id as never, shapeOrigin.current, point, styleOf(), {
          filled: settings.current.filled,
          constrain: shiftHeld.current,
        });
        return;
      }

      const ctx = ctxOf(strokeOnScratch.current ? previewRef : artRef);
      const from = lastPoint.current;
      if (!ctx || !from || !isBrush(definition.id)) return;

      const now = performance.now();
      const elapsed = Math.max(1, now - lastTime.current);
      const speed = Math.hypot(point.x - from.x, point.y - from.y) / elapsed;

      brushes[definition.id].segment({ ctx, from, to: point, style: styleOf(), speed });

      lastPoint.current = point;
      lastTime.current = now;
    },
    [pointFrom, clearPreview, styleOf]
  );

  const finishStroke = useCallback(
    (point: Point | null) => {
      if (!drawing.current) return;
      drawing.current = false;
      stopSpray();

      const definition = getTool(settings.current.tool);

      if (definition.kind === "shape" && shapeOrigin.current) {
        const ctx = ctxOf(artRef);
        const end = point ?? lastPoint.current;
        if (ctx && end) {
          drawShape(ctx, definition.id as never, shapeOrigin.current, end, styleOf(), {
            filled: settings.current.filled,
            constrain: shiftHeld.current,
          });
        }
        clearPreview();
        shapeOrigin.current = null;
      }

      // Wash the accumulated translucent stroke down in a single pass.
      if (strokeOnScratch.current) {
        const art = artRef.current;
        const preview = previewRef.current;
        const artCtx = ctxOf(artRef);
        const brush = isBrush(definition.id) ? brushes[definition.id] : null;

        if (art && preview && artCtx && brush?.compositeStroke) {
          artCtx.save();
          artCtx.setTransform(1, 0, 0, 1, 0, 0);
          artCtx.globalAlpha = brush.compositeStroke.alpha(settings.current.opacity);
          artCtx.globalCompositeOperation = brush.compositeStroke.mode;
          artCtx.drawImage(preview, 0, 0);
          artCtx.restore();
        }
        clearPreview();
        strokeOnScratch.current = false;
      }

      lastPoint.current = null;
      snapshot();
    },
    [stopSpray, clearPreview, styleOf, snapshot]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* already released */
      }
      finishStroke(pointFrom(e));
    },
    [finishStroke, pointFrom]
  );

  const handlePointerLeave = useCallback(() => {
    setCursor(null);
  }, []);

  // --- History actions ---------------------------------------------------

  const undo = useCallback(() => restore(history.current.undo()), [restore]);
  const redo = useCallback(() => restore(history.current.redo()), [restore]);

  const clear = useCallback(() => {
    const canvas = artRef.current;
    const ctx = ctxOf(artRef);
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    snapshot();
  }, [snapshot]);

  // --- Import / export ---------------------------------------------------

  const importImage = useCallback(
    (file: File) => {
      const container = containerRef.current;
      const ctx = ctxOf(artRef);
      if (!container || !ctx) return;

      loadImageFile(file)
        .then((image) => {
          const rect = container.getBoundingClientRect();
          drawImageFitted(ctx, image, rect.width, rect.height);
          snapshot();
          flash("Image added");
        })
        .catch((error: Error) => flash(error.message));
    },
    [snapshot, flash]
  );

  const exportImage = useCallback(
    (format: ExportFormat) => {
      const bg = backgroundRef.current;
      const art = artRef.current;
      if (!bg || !art) return;
      downloadCanvas(bg, art, format);
    },
    []
  );

  const copyImage = useCallback(() => {
    const bg = backgroundRef.current;
    const art = artRef.current;
    if (!bg || !art) return;
    copyCanvasToClipboard(bg, art)
      .then(() => flash("Copied to clipboard"))
      .catch((error: Error) => flash(error.message));
  }, [flash]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = imageFromDataTransfer(e.dataTransfer);
      if (file) importImage(file);
      else flash("That file isn't a supported image");
    },
    [importImage, flash]
  );

  // --- Keyboard ----------------------------------------------------------

  useEffect(() => {
    const isTypingElsewhere = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      return (
        el.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingElsewhere(e.target)) return;

      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        exportImage("png");
        return;
      }
      if (meta) return;

      if (e.key === "[") {
        e.preventDefault();
        setSize(settings.current.size - 2);
        return;
      }
      if (e.key === "]") {
        e.preventDefault();
        setSize(settings.current.size + 2);
        return;
      }

      const match = toolForShortcut(e.key);
      if (match) {
        e.preventDefault();
        setTool(match.id);
      }
    };

    const onPaste = (e: ClipboardEvent) => {
      if (isTypingElsewhere(e.target)) return;
      const file = imageFromDataTransfer(e.clipboardData);
      if (file) {
        e.preventDefault();
        importImage(file);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("paste", onPaste);
    };
  }, [undo, redo, exportImage, setSize, setTool, importImage]);

  useEffect(() => stopSpray, [stopSpray]);

  const cursorDiameter = isBrush(tool)
    ? brushDiameter(tool as BrushId, size)
    : isShape(tool)
      ? Math.max(6, size)
      : 0;

  return {
    containerRef,
    backgroundRef,
    artRef,
    previewRef,
    tool,
    setTool,
    color,
    setColor,
    size,
    setSize,
    opacity,
    setOpacity,
    filled,
    setFilled,
    tolerance,
    setTolerance,
    stamp,
    setStamp,
    background,
    setBackground,
    recentColors,
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
    cursor,
    cursorDiameter,
    textDraft,
    updateTextDraft,
    commitText,
    cancelText,
    isDragging,
    status,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    importImage,
    exportImage,
    copyImage,
  };
}
