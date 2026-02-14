export class Node {
  public prev: Node | null = null;
  public next: Node | null = null;

  constructor(
    public key: number,
    public val: number,
  ) {}
}
