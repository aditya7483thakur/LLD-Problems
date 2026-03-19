export class Ladder {
  constructor(
    public readonly start: number,
    public readonly end: number,
  ) {
    if (start >= end) {
      throw new Error(`Invalid ladder: ${start} -> ${end}`);
    }
  }
}
