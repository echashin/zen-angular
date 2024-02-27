import { MultiPolygon, Pair, Polygon, Ring } from 'polygon-clipping';

export function MoveMultiPolygon(mPolygon: MultiPolygon, moveVector: Pair): MultiPolygon {
  return mPolygon.map((polygon: Polygon) => polygon.map((ring: Ring) => MoveRing(ring, moveVector)));
}

export function MoveRing(ring: Ring, moveVector: Pair): Ring {
  if (ring.length === 0) return [];

  return ring.map(
    ([x, y]: Pair): Pair => {
      return [x + moveVector[0], y + moveVector[1]];
    },
  );
}
