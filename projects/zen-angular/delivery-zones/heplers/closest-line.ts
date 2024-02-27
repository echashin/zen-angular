import {Pair, Polygon, Ring} from "polygon-clipping";
import {PointWithDistance, PointWithDistancePolygon, PointWithDistanceRing} from "../types/point-with-distance";

export function DistanceAndNormalPoint([[x1,y1], [x2, y2]]: [Pair, Pair], [x3, y3]: Pair, maxDist: number): PointWithDistance | null {
  let dx: number = x2 - x1;
  let dy: number = y2 - y1;
  const mag: number = Math.sqrt(dx*dx + dy*dy);
  dx = dx / mag;
  dy = dy / mag;

  const lambda: number = (dx * (x3 - x1)) + (dy * (y3 - y1));
  const x4: number = (dx * lambda) + x1;
  const y4: number = (dy * lambda) + y1;
  const distance: number = Math.hypot(x4-x3,y4-y3);

  const isXBetween: boolean = Math.min(x1, x2) < x4 && Math.max(x1, x2) > x4;
  const isYBetween: boolean = Math.min(y1, y2) < y4 && Math.max(y1, y2) > y4;

  if (isXBetween && isYBetween && distance <= maxDist) {
    return {
      point: [x4,y4],
      distance,
    }
  }

  return null;
}

export function DistanceAndNormalPointForRing(ring: Ring, point: Pair, maxDist: number): PointWithDistanceRing | null {
  let pointWithDistance: PointWithDistanceRing | null = null;

  for (let pairIndex: number = ring.length - 1; pairIndex >= 0; pairIndex--) {
    const pwd: PointWithDistance | null = DistanceAndNormalPoint([ring.at(pairIndex)!, ring.at(pairIndex-1)!], point, maxDist);
    if (pwd && (!pointWithDistance || pointWithDistance?.distance > pwd?.distance)) {
      pointWithDistance = pwd ? {...pwd, pairIndex} : null;
    }
  }

  return pointWithDistance;
}

/**
 * @param polygon
 * @param point
 * @param maxDist - max distance to show point
 * @constructor
 */
export function DistanceAndNormalPointForPolygon(polygon: Polygon, point: Pair, maxDist: number): PointWithDistancePolygon | null {
  let pointWithDistance: PointWithDistancePolygon | null = null;

  for (const [ringIndex, ring] of polygon.entries()) {
    const pwd: PointWithDistanceRing | null = DistanceAndNormalPointForRing(ring, point, maxDist);
    if (pwd && (!pointWithDistance || pointWithDistance?.distance > pwd?.distance)) {
      pointWithDistance = pwd ? {...pwd, ringIndex} : null;
    }
  }

  return pointWithDistance;
}