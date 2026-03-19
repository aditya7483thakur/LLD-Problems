import { Board } from "./board";
import { GameStatus, PlayerSymbol } from "./enums";
import { Player } from "./player";
import { TicTacToeGame } from "./ticTacToeGame";
import { Position } from "./types";

const board = new Board(3);
const playerOne = new Player("P1", "Aditya", PlayerSymbol.X);
const playerTwo = new Player("P2", "Rohit", PlayerSymbol.O);

const game = new TicTacToeGame(board, [playerOne, playerTwo]);

const scriptedMoves: Position[] = [
  { row: 0, col: 0 },
  { row: 1, col: 1 },
  { row: 0, col: 1 },
  { row: 2, col: 2 },
  { row: 0, col: 2 },
];

console.log("=== Tic Tac Toe Demo ===\n");
console.log(game.getBoardState());
console.log();

for (const move of scriptedMoves) {
  const player = game.getCurrentPlayer();
  const result = game.playMove(move);

  console.log(
    `${player.name} (${player.symbol}) played at (${move.row}, ${move.col})`,
  );
  console.log(result.boardState);
  console.log();

  if (result.status !== GameStatus.IN_PROGRESS) {
    break;
  }
}

if (game.getStatus() === GameStatus.WIN) {
  const winner = game.getWinner() as Player;
  console.log(`Winner: ${winner.name} (${winner.symbol})`);
} else if (game.getStatus() === GameStatus.DRAW) {
  console.log("Game ended in a draw");
}
