import { GameStatus } from "./enums";
import { Player } from "./player";

export type Position = {
  row: number;
  col: number;
};

export type MoveResult = {
  status: GameStatus;
  winner: Player | null;
  boardState: string;
  nextPlayer: Player | null;
};
