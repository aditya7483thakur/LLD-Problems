import { PlayerSymbol } from "./enums";
import { Position } from "./types";

export class Board {
  private readonly grid: Array<Array<PlayerSymbol | null>>;
  private readonly rowCounts: number[];
  private readonly colCounts: number[];
  private diagonalCount: number = 0;
  private antiDiagonalCount: number = 0;
  private winnerSymbol: PlayerSymbol | null = null;
  private movesPlayed: number = 0;

  constructor(private readonly size: number = 3) {
    if (size < 3) {
      throw new Error("Board size must be at least 3");
    }

    this.grid = Array.from({ length: size }, () =>
      Array<PlayerSymbol | null>(size).fill(null),
    );
    this.rowCounts = Array<number>(size).fill(0);
    this.colCounts = Array<number>(size).fill(0);
  }

  getSize(): number {
    return this.size;
  }

  makeMove(position: Position, symbol: PlayerSymbol): void {
    this.validatePosition(position);

    if (!this.isCellEmpty(position)) {
      throw new Error(
        `Cell (${position.row}, ${position.col}) is already occupied`,
      );
    }

    this.grid[position.row][position.col] = symbol;
    this.movesPlayed++;
    this.updateWinningTrackers(position, symbol);
  }

  isCellEmpty(position: Position): boolean {
    this.validatePosition(position);
    return this.grid[position.row][position.col] === null;
  }

  hasWinner(symbol: PlayerSymbol): boolean {
    return this.winnerSymbol === symbol;
  }

  isFull(): boolean {
    return this.movesPlayed === this.size * this.size;
  }

  render(): string {
    const rowSeparator = "\n" + "-".repeat(this.size * 4 - 3) + "\n";

    return this.grid
      .map((row) => row.map((cell) => cell ?? " ").join(" | "))
      .join(rowSeparator);
  }

  private validatePosition(position: Position): void {
    if (
      position.row < 0 ||
      position.row >= this.size ||
      position.col < 0 ||
      position.col >= this.size
    ) {
      throw new Error(
        `Position out of board range: (${position.row}, ${position.col})`,
      );
    }
  }

  private updateWinningTrackers(position: Position, symbol: PlayerSymbol): void {
    const delta = symbol === PlayerSymbol.X ? 1 : -1;

    this.rowCounts[position.row] += delta;
    this.colCounts[position.col] += delta;

    let hasWinningLine =
      Math.abs(this.rowCounts[position.row]) === this.size ||
      Math.abs(this.colCounts[position.col]) === this.size;

    if (position.row === position.col) {
      this.diagonalCount += delta;
      if (Math.abs(this.diagonalCount) === this.size) {
        hasWinningLine = true;
      }
    }

    if (position.row + position.col === this.size - 1) {
      this.antiDiagonalCount += delta;
      if (Math.abs(this.antiDiagonalCount) === this.size) {
        hasWinningLine = true;
      }
    }

    if (hasWinningLine) {
      this.winnerSymbol = symbol;
    }
  }
}
