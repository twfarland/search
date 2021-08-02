import { minBy } from "./util";

// invariant = a parent node value must be <= both its child node values
export class MinBinaryHeap<T> {
  constructor(private score: (item: T) => number, private values: T[] = []) {}

  private left(i: number) {
    return 2 * i + 1;
  }

  private right(i: number) {
    return 2 * i + 2;
  }

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }

  private swap(i1: number, i2: number) {
    const v1 = this.values[i1];
    const v2 = this.values[i2];
    this.values[i1] = v2;
    this.values[i2] = v1;
    return this.values;
  }

  private bubbleUp() {
    // insertion index
    let index = this.values.length - 1; // last
    let bubbling = true;

    //loop while index is not 0 or element no longer needs to bubble
    while (index > 0 && bubbling) {
      const parentIndex = this.parent(index);
      const parentValue = this.values[parentIndex];
      const value = this.values[index];

      bubbling =
        parentValue !== undefined &&
        value !== undefined &&
        this.score(parentValue) > this.score(value);

      if (bubbling) {
        this.swap(index, parentIndex);
        index = parentIndex;
      }
    }
  }

  private bubbleDown() {
    let parentIndex = 0;
    let bubbling = true;

    // loop while swaps are needed
    while (bubbling) {
      const leftChildIndex = this.left(parentIndex);
      const rightChildIndex = this.right(parentIndex);

      const indexes = [parentIndex, leftChildIndex, rightChildIndex].filter(
        (index) => this.values[index] !== undefined
      );

      const minIndex = minBy(indexes, (index) =>
        this.score(this.values[index])
      );

      // if node is <= both of its children, or have hit bottom of heap, we're done
      bubbling = !(
        minIndex === undefined ||
        parentIndex === undefined ||
        minIndex === parentIndex
      );

      // othwerise, take smallest child, and swap with parent (make it the root)
      if (bubbling && parentIndex !== undefined && minIndex !== undefined) {
        this.swap(parentIndex, minIndex);
        parentIndex = minIndex;
      }
    }
  }

  push(value: T) {
    this.values.push(value);
    this.bubbleUp();
    return this.values;
  }

  pop(): T | undefined {
    // swap max and min
    this.swap(0, this.values.length - 1);
    const min = this.values.pop();

    // repair heap so invariant holds
    if (this.values.length > 1) {
      this.bubbleDown();
    }
    return min;
  }

  get length() {
    return this.values.length;
  }
}
