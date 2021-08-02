import { PriorityQueue } from "./PriorityQueue";

export interface SearchProblem<V> {
  getKey: (vertex: V) => string; // could be memoized
  start: V;
  goal: V;
  successors: (vertex: V) => V[];
}

export interface GraphSearchProblem<V> extends SearchProblem<V> {
  combiner: (newVertex: V, oldVertices: V[]) => void;
  // mutates old vertices - dfs should use shift, bfs should use push
}

export interface CostSearchProblem<V> extends SearchProblem<V> {
  cost: (from: V, to: V) => number;
}

export interface HeuristicSearchProblem<V> extends SearchProblem<V> {
  heuristic: (goal: V, current: V) => number;
}

function reconstructPath<V>(
  parents: Map<string, V>,
  getKey: (vertex: V) => string,
  start: V,
  goal: V
): V[] {
  const path: V[] = [];
  let current: V | undefined = goal;

  while (current !== undefined && getKey(current) !== getKey(start)) {
    path.unshift(current);
    current = parents.get(getKey(current));
  }
  path.unshift(start);

  return path;
}

export function graphSearch<V>({
  getKey,
  start,
  goal,
  successors,
  combiner,
}: GraphSearchProblem<V>) {
  const frontier: V[] = [start];
  const parents = new Map<string, V>();

  while (frontier.length > 0) {
    const current = frontier.pop();

    if (current === undefined) {
      return;
    }

    if (getKey(goal) === getKey(current)) {
      return reconstructPath(parents, getKey, start, current);
    }

    for (const next of successors(current)) {
      const nextKey = getKey(next);
      if (!parents.has(nextKey)) {
        combiner(next, frontier);
        parents.set(nextKey, current);
      }
    }
  }
}

interface CostSearchResult<V> {
  path: V[];
  costs: Map<string, number>;
}

export function dijkstra<V>({
  getKey,
  start,
  goal,
  cost,
  successors,
}: CostSearchProblem<V>): undefined | CostSearchResult<V> {
  const frontier = new PriorityQueue<V>();
  frontier.push(start, 0);

  const costSoFar = new Map<string, number>();
  costSoFar.set(getKey(start), 0);

  const parents = new Map<string, V>();

  while (frontier.length > 0) {
    const current = frontier.pop();

    if (current === undefined) {
      return;
    }

    const key = getKey(current);

    if (getKey(goal) === key) {
      return {
        path: reconstructPath(parents, getKey, start, current),
        costs: costSoFar,
      };
    }

    const currentCost = costSoFar.get(key);

    for (const next of successors(current)) {
      const nextKey = getKey(next);

      const nextCost =
        (currentCost === undefined ? Infinity : currentCost) +
        cost(current, next);

      const existingCost = costSoFar.get(nextKey);

      if (existingCost === undefined || nextCost < existingCost) {
        costSoFar.set(nextKey, nextCost);
        frontier.push(next, nextCost);
        parents.set(nextKey, current);
      }
    }
  }
}

export function greedyBestFirst<V>({
  getKey,
  start,
  goal,
  heuristic,
  successors,
}: HeuristicSearchProblem<V>): undefined | V[] {
  const frontier = new PriorityQueue<V>();
  frontier.push(start, 0);

  const parents = new Map<string, V>();

  while (frontier.length > 0) {
    const current = frontier.pop();

    if (current === undefined) {
      return;
    }

    if (getKey(current) === getKey(goal)) {
      return reconstructPath(parents, getKey, start, current);
    }

    for (const next of successors(current)) {
      const nextKey = getKey(next);
      const existing = parents.get(nextKey);
      if (existing === undefined) {
        frontier.push(next, heuristic(goal, next));
        parents.set(nextKey, current);
      }
    }
  }
}

export function aStar<V>({
  getKey,
  start,
  goal,
  heuristic,
  cost,
  successors,
}: HeuristicSearchProblem<V> & CostSearchProblem<V>):
  | undefined
  | CostSearchResult<V> {
  const frontier = new PriorityQueue<V>();
  frontier.push(start, 0);

  const costSoFar = new Map<string, number>();
  costSoFar.set(getKey(start), 0);

  const parents = new Map<string, V>();

  while (frontier.length > 0) {
    const current = frontier.pop();

    if (current === undefined) {
      return;
    }

    const key = getKey(current);

    if (getKey(goal) === key) {
      return {
        path: reconstructPath(parents, getKey, start, current),
        costs: costSoFar,
      };
    }

    const currentCost = costSoFar.get(key);

    for (const next of successors(current)) {
      const nextKey = getKey(next);

      const nextCost =
        (currentCost === undefined ? Infinity : currentCost) +
        cost(current, next);

      const existingCost = costSoFar.get(nextKey);

      if (existingCost === undefined || nextCost < existingCost) {
        costSoFar.set(nextKey, nextCost);
        frontier.push(next, nextCost + heuristic(goal, next));
        parents.set(nextKey, current);
      }
    }
  }
}
