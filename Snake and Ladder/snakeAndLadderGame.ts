import { Board } from "./board";
import { Dice } from "./dice";
import { Player } from "./player";

export class SnakeAndLadderGame {
  private readonly playersQueue: Player[];

  constructor(
    private readonly board: Board,
    private readonly dice: Dice,
    players: Player[],
  ) {
    if (players.length < 2) {
      throw new Error("At least 2 players are required");
    }

    this.playersQueue = [...players];
  }

  play(): Player {
    while (true) {
      const currentPlayer = this.playersQueue.shift() as Player;
      const rolledValue = this.dice.roll();
      const currentPosition = currentPlayer.getPosition();
      const tentativePosition = currentPosition + rolledValue;

      let finalPosition = currentPosition;

      if (tentativePosition <= this.board.getSize()) {
        finalPosition = this.board.resolvePosition(tentativePosition);
        currentPlayer.setPosition(finalPosition);
      }

      console.log(
        `${currentPlayer.name} rolled ${rolledValue}, moved from ${currentPosition} to ${currentPlayer.getPosition()}`,
      );

      if (finalPosition === this.board.getSize()) {
        return currentPlayer;
      }

      this.playersQueue.push(currentPlayer);
    }
  }
}
