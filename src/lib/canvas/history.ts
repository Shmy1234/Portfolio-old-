/**
 * Undo history for the art layer.
 *
 * Replaces the previous command model, which stored a full ImageData for
 * both the "before" and "after" of every stroke. Each command's `after`
 * was a byte-for-byte copy of the next command's `before`, so the canvas
 * retained roughly twice the pixels it needed. A single snapshot stack
 * with a cursor gives identical undo/redo behaviour at half the memory.
 */
export class HistoryStack {
  private states: ImageData[] = [];
  private cursor = -1;
  private readonly limit: number;

  constructor(limit = 30) {
    this.limit = limit;
  }

  /** Seeds the stack with the empty canvas so the first undo has a floor. */
  reset(initial: ImageData): void {
    this.states = [initial];
    this.cursor = 0;
  }

  /** Records a completed edit. Discards any redo branch. */
  push(state: ImageData): void {
    this.states = this.states.slice(0, this.cursor + 1);
    this.states.push(state);

    if (this.states.length > this.limit) {
      this.states.shift();
    }
    this.cursor = this.states.length - 1;
  }

  undo(): ImageData | null {
    if (!this.canUndo()) return null;
    this.cursor -= 1;
    return this.states[this.cursor];
  }

  redo(): ImageData | null {
    if (!this.canRedo()) return null;
    this.cursor += 1;
    return this.states[this.cursor];
  }

  canUndo(): boolean {
    return this.cursor > 0;
  }

  canRedo(): boolean {
    return this.cursor < this.states.length - 1;
  }
}
