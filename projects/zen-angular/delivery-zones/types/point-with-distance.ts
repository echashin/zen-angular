import {Pair} from "polygon-clipping";

export type PointWithDistance = {
  point: Pair,
  distance: number,
}

export type PointWithDistanceRing = PointWithDistance & {
  pairIndex: number;
}

export type PointWithDistancePolygon = PointWithDistanceRing & {
  ringIndex: number;
}