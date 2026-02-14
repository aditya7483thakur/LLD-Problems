import { DoublyLinkedList } from "./doublyLinkedList";
import { Node } from "./node";

export class LRUcache {
  private readonly cache: Map<number, Node> = new Map();
  private readonly list: DoublyLinkedList = new DoublyLinkedList();

  constructor(private readonly capacity: number) {}

  public get(key: number): number {
    const node = this.cache.get(key);

    if (!node) return -1;

    // Update recency
    this.list.moveToFront(node);

    return node.val;
  }

  public put(key: number, val: number) {
    const existingNode = this.cache.get(key);

    //Case 1: key exists
    if (existingNode) {
      existingNode.val = val;
      this.list.moveToFront(existingNode);
      return;
    }

    //Case 2: key does not exists
    const newNode = new Node(key, val);
    this.list.addToFront(newNode);
    this.cache.set(key, newNode);
    if (this.cache.size > this.capacity) {
      const lru = this.list.removeLRU();
      if (lru) {
        this.cache.delete(lru.key);
      }
    }
  }
}
