import { PAPER_COLOR } from "./backgrounds";
import { ExportFormat } from "./types";

export const MAX_IMPORT_BYTES = 12 * 1024 * 1024;

const IMPORT_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function isSupportedImage(file: File): boolean {
  return IMPORT_TYPES.includes(file.type);
}

/** Decodes a File into an <img>, revoking the object URL either way. */
export function loadImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!isSupportedImage(file)) {
      reject(new Error("Unsupported image type"));
      return;
    }
    if (file.size > MAX_IMPORT_BYTES) {
      reject(new Error("Image is larger than 12 MB"));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode that image"));
    };
    image.src = url;
  });
}

/**
 * Draws an image centred and scaled to fit inside the canvas, never
 * upscaling past its natural size and leaving a small margin.
 */
export function drawImageFitted(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): void {
  const margin = 0.88;
  const scale = Math.min(
    (canvasWidth * margin) / image.naturalWidth,
    (canvasHeight * margin) / image.naturalHeight,
    1
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;

  ctx.drawImage(
    image,
    (canvasWidth - width) / 2,
    (canvasHeight - height) / 2,
    width,
    height
  );
}

/**
 * Flattens the paper and art layers into one canvas.
 * `png-transparent` skips the paper so the export drops onto any surface.
 */
export function composite(
  background: HTMLCanvasElement,
  art: HTMLCanvasElement,
  format: ExportFormat
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = art.width;
  out.height = art.height;
  const ctx = out.getContext("2d");
  if (!ctx) return out;

  if (format === "jpg") {
    // JPEG has no alpha; without this the transparent areas render black.
    ctx.fillStyle = PAPER_COLOR;
    ctx.fillRect(0, 0, out.width, out.height);
  }
  if (format !== "png-transparent") {
    ctx.drawImage(background, 0, 0);
  }
  ctx.drawImage(art, 0, 0);
  return out;
}

const MIME: Record<ExportFormat, string> = {
  png: "image/png",
  "png-transparent": "image/png",
  jpg: "image/jpeg",
};

const EXTENSION: Record<ExportFormat, string> = {
  png: "png",
  "png-transparent": "png",
  jpg: "jpg",
};

export function downloadCanvas(
  background: HTMLCanvasElement,
  art: HTMLCanvasElement,
  format: ExportFormat
): void {
  const flattened = composite(background, art, format);
  const link = document.createElement("a");
  link.download = `notebook-${Date.now()}.${EXTENSION[format]}`;
  link.href = flattened.toDataURL(MIME[format], format === "jpg" ? 0.92 : undefined);
  link.click();
}

/** Copies the flattened artwork to the clipboard as a PNG. */
export async function copyCanvasToClipboard(
  background: HTMLCanvasElement,
  art: HTMLCanvasElement
): Promise<void> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    throw new Error("This browser can't copy images to the clipboard");
  }

  const flattened = composite(background, art, "png");
  const blob = await new Promise<Blob | null>((resolve) =>
    flattened.toBlob(resolve, "image/png")
  );
  if (!blob) throw new Error("Could not encode the image");

  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

/** Pulls the first image out of a paste or drop event, if there is one. */
export function imageFromDataTransfer(data: DataTransfer | null): File | null {
  if (!data) return null;
  for (const item of Array.from(data.files)) {
    if (isSupportedImage(item)) return item;
  }
  return null;
}
