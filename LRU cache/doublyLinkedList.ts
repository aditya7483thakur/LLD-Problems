import { Node } from "./node";

export class DoublyLinkedList {
  private head: Node;
  private tail: Node;

  constructor() {
    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public addToFront(node: Node): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  public removeNode(node: Node): void {
    node.next.prev = node.prev;
    node.prev.next = node.next;

    node.next = null;
    node.prev = null;
  }

  public moveToFront(node: Node): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  public removeLRU(): Node | null {
    const lru = this.tail.prev;
    if (lru == this.head) return null;

    this.removeNode(lru);
    return lru;
  }
}
