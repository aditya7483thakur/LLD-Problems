export class Player {
  constructor(
    public readonly id: string,
    public readonly name: string,
    private position: number = 0,
  ) {}

  getPosition(): number {
    return this.position;
  }

  setPosition(position: number): void {
    this.position = position;
  }
}
