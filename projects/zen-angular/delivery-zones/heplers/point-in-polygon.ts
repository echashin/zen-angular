import { Pair, Polygon, Ring } from 'polygon-clipping';

/**
 * @param point mouse point
 * @param polygon polygon
 * @returns boolean
 */
export function isPointInPolygon(point: Pair, polygon: Polygon): boolean {
  const isIn: boolean = PointInPolygon(point, polygon[0]);

  for (const ring of polygon.slice(1)) {
    if (isIn && PointInPolygon(point, ring)) {
      return false;
    }
  }

  return isIn;
}

export function isInsideRect([[x1,y1],[x2,y2]]: [Pair, Pair], [px, py]: Pair): boolean {
  return px >= x1 && px <= x2 && py >= y1 && py <= y2;
}

export function PointInPolygon(point: Pair, ring: Ring): boolean {
  const x: number = point[0],
    y: number = point[1];

  let inside: boolean = false;
  for (let i: number = 0, j: number = ring.length - 1; i < ring.length; j = i++) {
    const xi: number = ring[i][0],
      yi: number = ring[i][1];
    const xj: number = ring[j][0],
      yj: number = ring[j][1];

    const intersect: boolean = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}
