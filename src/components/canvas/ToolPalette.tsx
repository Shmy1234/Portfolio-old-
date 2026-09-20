import { TOOLS, ToolDefinition, ToolId } from "@/lib/canvas/tools";
import { STAMP_LABELS } from "@/lib/canvas/stamps";
import { StampKind } from "@/lib/canvas/types";

interface ToolPaletteProps {
  tool: ToolId;
  setTool: (tool: ToolId) => void;
  filled: boolean;
  setFilled: (filled: boolean) => void;
  stamp: StampKind;
  setStamp: (stamp: StampKind) => void;
}

const GROUPS: { key: ToolDefinition["group"]; label: string }[] = [
  { key: "draw", label: "Brushes" },
  { key: "shape", label: "Shapes" },
  { key: "utility", label: "Tools" },
];

export function ToolPalette({
  tool,
  setTool,
  filled,
  setFilled,
  stamp,
  setStamp,
}: ToolPaletteProps) {
  const isShapeTool = ["line", "arrow", "rect", "ellipse"].includes(tool);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {GROUPS.map(({ key, label }, groupIndex) => (
        <div key={key} className="flex items-center gap-1">
          {groupIndex > 0 && (
            <span className="w-px h-5 bg-border mr-1" aria-hidden="true" />
          )}
          <div className="flex gap-0.5" role="group" aria-label={label}>
            {TOOLS.filter((t) => t.group === key).map((definition) => {
              const Icon = definition.icon;
              const active = tool === definition.id;
              return (
                <button
                  key={definition.id}
                  type="button"
                  onClick={() => setTool(definition.id)}
                  aria-pressed={active}
                  title={`${definition.label} (${definition.shortcut.toUpperCase()})`}
                  aria-label={definition.label}
                  className={`p-1.5 rounded transition-all ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Outline vs solid, only meaningful for closed shapes */}
      {(tool === "rect" || tool === "ellipse") && (
        <label className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={filled}
            onChange={(e) => setFilled(e.target.checked)}
            className="accent-[hsl(var(--accent))] w-3 h-3"
          />
          Fill shape
        </label>
      )}

      {isShapeTool && (
        <span className="text-[10px] font-body text-muted-foreground">
          Hold Shift to constrain
        </span>
      )}

      {tool === "stamp" && (
        <div className="flex gap-0.5">
          {(Object.keys(STAMP_LABELS) as StampKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setStamp(kind)}
              aria-pressed={stamp === kind}
              title={STAMP_LABELS[kind]}
              className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${
                stamp === kind
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {STAMP_LABELS[kind]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
