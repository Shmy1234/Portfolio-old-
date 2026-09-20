import { Slider } from "@/components/ui/slider";
import { COLORS, getTool, ToolId } from "@/lib/canvas/tools";

interface ColorPanelProps {
  tool: ToolId;
  color: string;
  setColor: (color: string) => void;
  recentColors: string[];
  size: number;
  setSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  tolerance: number;
  setTolerance: (tolerance: number) => void;
}

function Swatch({
  color,
  active,
  onSelect,
}: {
  color: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Select colour ${color}`}
      title={color.toUpperCase()}
      className={`w-5 h-5 rounded-full border transition-all ${
        active
          ? "border-foreground scale-110 shadow-md"
          : "border-black/10 hover:scale-105"
      }`}
      style={{ backgroundColor: color }}
    />
  );
}

export function ColorPanel({
  tool,
  color,
  setColor,
  recentColors,
  size,
  setSize,
  opacity,
  setOpacity,
  tolerance,
  setTolerance,
}: ColorPanelProps) {
  const definition = getTool(tool);
  const showColor = definition.usesColor;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {showColor && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {COLORS.map((swatch) => (
            <Swatch
              key={swatch}
              color={swatch}
              active={color.toLowerCase() === swatch.toLowerCase()}
              onSelect={() => setColor(swatch)}
            />
          ))}

          {/* Native picker for anything not on the palette */}
          <label
            className="relative w-5 h-5 rounded-full overflow-hidden border border-black/20 cursor-pointer shrink-0"
            title="Custom colour"
            style={{
              background:
                "conic-gradient(#DC143C, #DAA520, #2E4A2E, #4A7C7C, #4169E1, #8B4513, #DC143C)",
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Pick a custom colour"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>

          {recentColors.length > 0 && (
            <>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              {recentColors.map((swatch) => (
                <Swatch
                  key={swatch}
                  color={swatch}
                  active={color.toLowerCase() === swatch.toLowerCase()}
                  onSelect={() => setColor(swatch)}
                />
              ))}
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        <span className="w-12 text-[10px] font-body text-muted-foreground whitespace-nowrap tabular-nums">
          Size {size}
        </span>
        <Slider
          value={[size]}
          onValueChange={([next]) => setSize(next)}
          min={2}
          max={60}
          step={1}
          aria-label="Brush size"
          className="w-20 shrink-0"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="w-20 text-[10px] font-body text-muted-foreground whitespace-nowrap tabular-nums">
          Opacity {Math.round(opacity * 100)}%
        </span>
        <Slider
          value={[opacity * 100]}
          onValueChange={([next]) => setOpacity(next / 100)}
          min={5}
          max={100}
          step={5}
          aria-label="Opacity"
          className="w-20 shrink-0"
        />
      </div>

      {tool === "fill" && (
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-20 text-[10px] font-body text-muted-foreground whitespace-nowrap tabular-nums">
            Tolerance {tolerance}
          </span>
          <Slider
            value={[tolerance]}
            onValueChange={([next]) => setTolerance(next)}
            min={0}
            max={100}
            step={1}
            aria-label="Fill tolerance"
            className="w-20 shrink-0"
          />
        </div>
      )}
    </div>
  );
}
