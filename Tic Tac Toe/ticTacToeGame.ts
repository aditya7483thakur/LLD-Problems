import { Board } from "./board";
import { GameStatus } from "./enums";
import { Player } from "./player";
import { MoveResult, Position } from "./types";

export class TicTacToeGame {
  private currentTurn: number = 0;
  private status: GameStatus = GameStatus.IN_PROGRESS;
  private winner: Player | null = null;

  constructor(
    private readonly board: Board,
    private readonly players: [Player, Player],
  ) {
    if (players[0].symbol === players[1].symbol) {
      throw new Error("Players must use different symbols");
    }
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentTurn];
  }

  getStatus(): GameStatus {
    return this.status;
  }

  getWinner(): Player | null {
    return this.winner;
  }

  playMove(position: Position): MoveResult {
    if (this.status !== GameStatus.IN_PROGRESS) {
      throw new Error(`Game has already ended with status: ${this.status}`);
    }

    const currentPlayer = this.getCurrentPlayer();
    this.board.makeMove(position, currentPlayer.symbol);

    if (this.board.hasWinner(currentPlayer.symbol)) {
      this.status = GameStatus.WIN;
      this.winner = currentPlayer;
      return this.buildMoveResult(null);
    }

    if (this.board.isFull()) {
      this.status = GameStatus.DRAW;
      return this.buildMoveResult(null);
    }

    this.currentTurn = (this.currentTurn + 1) % this.players.length;
    return this.buildMoveResult(this.getCurrentPlayer());
  }

  getBoardState(): string {
    return this.board.render();
  }

  private buildMoveResult(nextPlayer: Player | null): MoveResult {
    return {
      status: this.status,
      winner: this.winner,
      boardState: this.board.render(),
      nextPlayer,
    };
  }
}
