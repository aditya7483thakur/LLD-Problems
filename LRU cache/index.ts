import { LRUcache } from "./lruCache";

const cache = new LRUcache(3);

// Test basic put and get
cache.put(1, 100);
cache.put(2, 200);
cache.put(3, 300);

console.log("Get key 1:", cache.get(1)); // 100
console.log("Get key 2:", cache.get(2)); // 200

// Add a 4th item - should evict key 3 (LRU)
cache.put(4, 400);
console.log("Get key 3 (evicted):", cache.get(3)); // -1
console.log("Get key 4:", cache.get(4)); // 400

// Update existing key
cache.put(1, 111);
console.log("Get key 1 (updated):", cache.get(1)); // 111

// Access key 2 to make it recently used, then add new items
cache.get(2);
cache.put(5, 500); // Should evict key 4
console.log("Get key 4 (evicted):", cache.get(4)); // -1
console.log("Get key 2 (still present):", cache.get(2)); // 200

console.log("\nAll tests passed!");
