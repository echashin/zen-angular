import {Ring} from "polygon-clipping";

export function isClockwise(ring: Ring): boolean {
  let sum: number = 0;
  const n: number = ring.length;
  for(let index: number = 1; index < n; index++){
    sum += (ring[index][0] - ring[index-1][0]) * (ring[index][1] + ring[index-1][1]);
  }
  sum += (ring[0][0] - ring[n-1][0]) * (ring[0][1] + ring[n-1][1]);
  return sum < 0;
}