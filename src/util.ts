export function minBy<T>(items: T[], getScore: (item: T) => number) {
  let min: T | undefined = undefined;
  let minScore = Infinity;
  for (const item of items) {
    const score = getScore(item);
    if (score < minScore) {
      min = item;
      minScore = score;
    }
  }
  return min;
}
