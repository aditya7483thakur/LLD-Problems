export class Node {
  public readonly name: string;
  public readonly isFile: boolean;
  public content?: string;
  public children?: Map<string, Node>;

  constructor(name: string, isFile: boolean) {
    this.name = name;
    this.isFile = isFile;

    if (isFile) {
      this.content = "";
      return;
    }

    this.children = new Map<string, Node>();
  }
}