export class Snake {
  constructor(
    public readonly head: number,
    public readonly tail: number,
  ) {
    if (head <= tail) {
      throw new Error(`Invalid snake: ${head} -> ${tail}`);
    }
  }
}
