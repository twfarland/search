import { MinBinaryHeap } from "./BinaryHeap";

export interface PriorityNode<T> {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private heap!: MinBinaryHeap<PriorityNode<T>>;

  constructor() {
    this.heap = new MinBinaryHeap(this.score); // @todo memoize score?
  }

  private score({ priority }: PriorityNode<T>): number {
    return priority;
  }

  push(value: T, priority: number) {
    this.heap.push({ value, priority });
  }

  pop(): T | undefined {
    const node = this.heap.pop();
    return node && node.value;
  }

  get length(): number {
    return this.heap.length;
  }
}

// run searches in a web worker?
// precalculate all paths of interest?
