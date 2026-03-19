import { Ladder } from "./ladder";
import { Snake } from "./snake";

export class Board {
  private readonly snakesByHead: Map<number, number>;
  private readonly laddersByStart: Map<number, number>;

  constructor(
    private readonly size: number,
    snakes: Snake[],
    ladders: Ladder[],
  ) {
    this.snakesByHead = this.buildSnakesMap(snakes);
    this.laddersByStart = this.buildLaddersMap(ladders);
    this.validateTransitions();
  }

  getSize(): number {
    return this.size;
  }

  resolvePosition(position: number): number {
    if (this.snakesByHead.has(position)) {
      return this.snakesByHead.get(position) as number;
    }

    if (this.laddersByStart.has(position)) {
      return this.laddersByStart.get(position) as number;
    }

    return position;
  }

  private validateTransitions(): void {
    const usedStartPoints = new Set<number>();

    for (const [start] of this.snakesByHead.entries()) {
      this.validateCellWithinBoard(start);
      if (usedStartPoints.has(start)) {
        throw new Error(`Duplicate transition start point: ${start}`);
      }
      usedStartPoints.add(start);
    }

    for (const [start] of this.laddersByStart.entries()) {
      this.validateCellWithinBoard(start);
      if (usedStartPoints.has(start)) {
        throw new Error(`Duplicate transition start point: ${start}`);
      }
      usedStartPoints.add(start);
    }
  }

  private validateCellWithinBoard(cell: number): void {
    if (cell <= 0 || cell > this.size) {
      throw new Error(`Transition cell out of board range: ${cell}`);
    }
  }

  private buildSnakesMap(snakes: Snake[]): Map<number, number> {
    const map = new Map<number, number>();
    for (const snake of snakes) {
      this.validateCellWithinBoard(snake.head);
      this.validateCellWithinBoard(snake.tail);
      map.set(snake.head, snake.tail);
    }
    return map;
  }

  private buildLaddersMap(ladders: Ladder[]): Map<number, number> {
    const map = new Map<number, number>();
    for (const ladder of ladders) {
      this.validateCellWithinBoard(ladder.start);
      this.validateCellWithinBoard(ladder.end);
      map.set(ladder.start, ladder.end);
    }
    return map;
  }
}
