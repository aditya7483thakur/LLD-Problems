import { Node } from "./node";

export class FileSystem {
  private readonly root: Node;

  constructor() {
    this.root = new Node("/", false);
  }

  ls(path: string): string[] {
    const node = this.traverse(path, false);

    if (node.isFile) {
      return [node.name];
    }

    return Array.from(node.children!.keys()).sort();
  }

  mkdir(path: string): void {
    this.traverse(path, true);
  }

  addContentToFile(filePath: string, content: string): void {
    const parts = this.getPathParts(filePath);
    if (parts.length === 0) {
      throw new Error("File path cannot be root");
    }

    const fileName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1);
    const parentNode = this.traverseParts(parentPath, true);

    if (parentNode.isFile) {
      throw new Error("Invalid file path");
    }

    const existing = parentNode.children!.get(fileName);

    if (existing !== undefined) {
      if (!existing.isFile) {
        throw new Error(`Path '${filePath}' is a directory`);
      }

      existing.content = `${existing.content ?? ""}${content}`;
      return;
    }

    const newFile = new Node(fileName, true);
    newFile.content = content;
    parentNode.children!.set(fileName, newFile);
  }

  readContentFromFile(filePath: string): string {
    const node = this.traverse(filePath, false);

    if (!node.isFile) {
      throw new Error(`Path '${filePath}' is a directory`);
    }

    return node.content ?? "";
  }

  private traverse(path: string, createMissingDirs: boolean): Node {
    const parts = this.getPathParts(path);
    return this.traverseParts(parts, createMissingDirs);
  }

  private traverseParts(parts: string[], createMissingDirs: boolean): Node {
    let current = this.root;

    for (const part of parts) {
      if (current.isFile) {
        throw new Error(`Cannot traverse through file '${current.name}'`);
      }

      const existing = current.children!.get(part);

      if (existing !== undefined) {
        current = existing;
        continue;
      }

      if (!createMissingDirs) {
        throw new Error(`Path does not exist: '/${parts.join("/")}'`);
      }

      const directory = new Node(part, false);
      current.children!.set(part, directory);
      current = directory;
    }

    return current;
  }

  private getPathParts(path: string): string[] {
    return path.split("/").filter((part) => part.length > 0);
  }
}