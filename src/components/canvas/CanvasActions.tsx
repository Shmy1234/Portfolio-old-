import { useRef } from "react";
import {
  Copy,
  Download,
  ImagePlus,
  Redo2,
  Trash2,
  Undo2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKGROUND_LABELS } from "@/lib/canvas/backgrounds";
import { BackgroundKind, ExportFormat } from "@/lib/canvas/types";

interface CanvasActionsProps {
  background: BackgroundKind;
  setBackground: (background: BackgroundKind) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onImport: (file: File) => void;
  onExport: (format: ExportFormat) => void;
  onCopy: () => void;
}

const EXPORT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: "png", label: "PNG" },
  { format: "png-transparent", label: "PNG (transparent)" },
  { format: "jpg", label: "JPG" },
];

export function CanvasActions({
  background,
  setBackground,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onImport,
  onExport,
  onCopy,
}: CanvasActionsProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Paper */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-body text-muted-foreground">Paper</span>
        {(Object.keys(BACKGROUND_LABELS) as BackgroundKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setBackground(kind)}
            aria-pressed={background === kind}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${
              background === kind
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {BACKGROUND_LABELS[kind]}
          </button>
        ))}
      </div>

      <span className="w-px h-5 bg-border" aria-hidden="true" />

      <div className="flex gap-1 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-7 w-7 p-0"
          title="Undo (Cmd+Z)"
          aria-label="Undo"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-7 w-7 p-0"
          title="Redo (Cmd+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </Button>

        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            // Reset so the same file can be chosen twice in a row.
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInput.current?.click()}
          className="h-7 px-2 gap-1 text-xs"
          title="Add an image (or drag one in, or paste)"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          Image
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="h-7 w-7 p-0"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 gap-1 text-xs"
          title="Clear the canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-7 px-2 gap-1 text-xs bg-accent hover:bg-accent/90"
              title="Save your drawing (Cmd+S)"
            >
              <Download className="w-3.5 h-3.5" />
              Save
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {EXPORT_OPTIONS.map(({ format, label }) => (
              <DropdownMenuItem key={format} onSelect={() => onExport(format)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
