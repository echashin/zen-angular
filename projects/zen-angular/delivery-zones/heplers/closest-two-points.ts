import {MultiPolygon, Pair, Polygon, Ring} from "polygon-clipping";
import {ClosestPointMultipolygon, ClosestPointPolygon, ClosestPointRing} from "../types/closest-point";

export function ClosestTwoPointsRing(ring: Ring, position: Pair): [ClosestPointRing, ClosestPointRing] {
  let first: ClosestPointRing = {
    pairIndex: 0,
    length: Infinity,
    pair: [0, 0]
  };
  let second: ClosestPointRing = {
    pairIndex: 0,
    length: Infinity,
    pair: [0, 0]
  };

  for (const [pairIndex, pair] of ring.entries()) {
    const length: number = Math.hypot(pair[0] - position[0], pair[1] - position[1]);
    if (first.length > length || second.length > length) {
      if (first.length > second.length) {
        first = {
          pairIndex,
          length,
          pair,
        };
      } else {
        second = {
          pairIndex,
          length,
          pair,
        };
      }
    }
  }

  return [first, second];
}

export function ClosestTwoPointsPolygon(polygon: Polygon, position: Pair): [ClosestPointPolygon, ClosestPointPolygon] {
  let closestPolygon: [ClosestPointPolygon, ClosestPointPolygon] = ClosestTwoPointsRing(polygon[0], position)
    .map((data: ClosestPointRing) => ({
      ...data,
      ringIndex: 0,
    })) as [ClosestPointPolygon, ClosestPointPolygon];

  let closestPolygonLength: number = closestPolygon[0].length + closestPolygon[1].length +
    Math.hypot(closestPolygon[0].pair[0] - closestPolygon[1].pair[0], closestPolygon[0].pair[1] - closestPolygon[1].pair[1]);

  for (const [ringIndex, ring] of polygon.slice(1).entries()) {
    const closestRing: [ClosestPointRing, ClosestPointRing] = ClosestTwoPointsRing(ring, position);
    const closestRingLength: number = closestRing[0].length + closestRing[1].length;

    if (closestPolygonLength > closestRingLength) {
      closestPolygon = [
        {...closestRing[0], ringIndex},
        {...closestRing[1], ringIndex},
      ]
      closestPolygonLength = closestRingLength;
    }
  }

  return closestPolygon;
}

export function ClosestTwoPointsMPolygon(mPolygon: MultiPolygon, position: Pair): [ClosestPointMultipolygon, ClosestPointMultipolygon] {
  let closestMPolygon: [ClosestPointMultipolygon, ClosestPointMultipolygon] = ClosestTwoPointsPolygon(mPolygon[0], position)
    .map((p: ClosestPointPolygon) => ({...p, polygonIndex: 0})) as [ClosestPointMultipolygon, ClosestPointMultipolygon];
  let closestMPolygonLength: number = closestMPolygon[0].length + closestMPolygon[1].length;

  for (const [polygonIndex, polygon] of mPolygon.slice(1).entries()) {
    const closestPolygon: [ClosestPointPolygon, ClosestPointPolygon] = ClosestTwoPointsPolygon(polygon, position);
    const closestPolygonLength: number = closestPolygon[0].length + closestPolygon[1].length;

    if (closestMPolygonLength > closestPolygonLength) {
      closestMPolygon = [
        {...closestPolygon[0], polygonIndex},
        {...closestPolygon[1], polygonIndex},
      ]
      closestMPolygonLength = closestPolygonLength;
    }
  }

  return closestMPolygon;
}