import { PlayerSymbol } from "./enums";

export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly symbol: PlayerSymbol,
  ) {}
}
