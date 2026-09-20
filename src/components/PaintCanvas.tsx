"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDrawingEngine } from "@/hooks/useDrawingEngine";
import { ToolPalette } from "./canvas/ToolPalette";
import { ColorPanel } from "./canvas/ColorPanel";
import { CanvasActions } from "./canvas/CanvasActions";
import { getTool } from "@/lib/canvas/tools";

/** Tools that get a crosshair rather than a size ring. */
const CROSSHAIR_TOOLS = ["fill", "eyedropper", "text", "stamp"];

export function PaintCanvas() {
  const engine = useDrawingEngine();
  const textInputRef = useRef<HTMLInputElement>(null);

  const definition = getTool(engine.tool);
  const showRing = engine.cursorDiameter > 0 && engine.cursor !== null;

  // Focus the inline text box the moment it appears.
  useEffect(() => {
    if (engine.textDraft) textInputRef.current?.focus();
  }, [engine.textDraft]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div
        ref={engine.containerRef}
        onDragOver={engine.handleDragOver}
        onDragLeave={engine.handleDragLeave}
        onDrop={engine.handleDrop}
        className={`relative flex-1 min-h-[380px] w-full rounded-lg overflow-hidden border-2 transition-colors ${
          engine.isDragging
            ? "border-accent border-dashed"
            : "border-paint-sienna/40"
        }`}
      >
        {/* Paper layer — repainted on demand, never part of undo history */}
        <canvas
          ref={engine.backgroundRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Art layer — everything the user draws */}
        <canvas
          ref={engine.artRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-label="Drawing canvas"
          role="img"
        />

        {/* Preview layer — live shape drags, cleared on commit */}
        <canvas
          ref={engine.previewRef}
          onPointerDown={engine.handlePointerDown}
          onPointerMove={engine.handlePointerMove}
          onPointerUp={engine.handlePointerUp}
          onPointerCancel={engine.handlePointerUp}
          onPointerLeave={engine.handlePointerLeave}
          className={`absolute inset-0 w-full h-full touch-none ${
            CROSSHAIR_TOOLS.includes(engine.tool) ? "cursor-crosshair" : "cursor-none"
          }`}
        />

        {/* Brush size ring, so you know how big the mark will be */}
        {showRing && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-paint-sienna/70 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${engine.cursor!.x}px`,
              top: `${engine.cursor!.y}px`,
              width: `${engine.cursorDiameter}px`,
              height: `${engine.cursorDiameter}px`,
            }}
          />
        )}

        {/* Inline text entry, positioned where the canvas was clicked */}
        {engine.textDraft && (
          <input
            ref={textInputRef}
            value={engine.textDraft.value}
            onChange={(e) => engine.updateTextDraft(e.target.value)}
            onBlur={engine.commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                engine.commitText();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                engine.cancelText();
              }
            }}
            placeholder="Type, then press Enter"
            aria-label="Text to add to the canvas"
            className="absolute z-10 bg-transparent border-b-2 border-accent outline-none px-1 -translate-y-1/2 min-w-[8rem] font-body"
            style={{
              left: `${engine.textDraft.x}px`,
              top: `${engine.textDraft.y}px`,
              color: engine.color,
              fontSize: `${Math.max(14, engine.size * 2.5)}px`,
            }}
          />
        )}

        {/* Drop target hint */}
        {engine.isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-accent/10 pointer-events-none">
            <span className="font-body text-sm font-medium text-accent">
              Drop an image to place it
            </span>
          </div>
        )}

        {/* Transient status line for picks, copies and import errors */}
        <AnimatePresence>
          {engine.status && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              role="status"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-body pointer-events-none"
            >
              {engine.status}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 space-y-1.5">
        <ToolPalette
          tool={engine.tool}
          setTool={engine.setTool}
          filled={engine.filled}
          setFilled={engine.setFilled}
          stamp={engine.stamp}
          setStamp={engine.setStamp}
        />
        <ColorPanel
          tool={engine.tool}
          color={engine.color}
          setColor={engine.setColor}
          recentColors={engine.recentColors}
          size={engine.size}
          setSize={engine.setSize}
          opacity={engine.opacity}
          setOpacity={engine.setOpacity}
          tolerance={engine.tolerance}
          setTolerance={engine.setTolerance}
        />
        <CanvasActions
          background={engine.background}
          setBackground={engine.setBackground}
          canUndo={engine.canUndo}
          canRedo={engine.canRedo}
          onUndo={engine.undo}
          onRedo={engine.redo}
          onClear={engine.clear}
          onImport={engine.importImage}
          onExport={engine.exportImage}
          onCopy={engine.copyImage}
        />
        <p className="text-[10px] font-body text-muted-foreground">
          {definition.label} · shortcuts: B M H A C E for brushes, L R U O for
          shapes, G I T S for fill, pick, text, stamp · [ ] resize · Cmd+Z undo ·
          Cmd+S save
        </p>
      </div>
    </div>
  );
}
