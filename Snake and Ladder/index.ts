import { Board } from "./board";
import { Dice } from "./dice";
import { Ladder } from "./ladder";
import { Player } from "./player";
import { Snake } from "./snake";
import { SnakeAndLadderGame } from "./snakeAndLadderGame";

const snakes: Snake[] = [
  new Snake(17, 7),
  new Snake(54, 34),
  new Snake(62, 19),
  new Snake(64, 60),
  new Snake(87, 24),
  new Snake(93, 73),
  new Snake(95, 75),
  new Snake(98, 79),
];

const ladders: Ladder[] = [
  new Ladder(1, 38),
  new Ladder(4, 14),
  new Ladder(9, 31),
  new Ladder(21, 42),
  new Ladder(28, 84),
  new Ladder(36, 44),
  new Ladder(51, 67),
  new Ladder(71, 91),
  new Ladder(80, 100),
];

const board = new Board(100, snakes, ladders);
const dice = new Dice(1, 6);

const players = [
  new Player("P1", "Aditya"),
  new Player("P2", "Rohit"),
  new Player("P3", "Neha"),
];

const game = new SnakeAndLadderGame(board, dice, players);
console.log("=== Snake and Ladder Demo ===\n");

const winner = game.play();
console.log(`\nWinner is ${winner.name} (Position: ${winner.getPosition()})`);
