import { Pair } from 'polygon-clipping';

import { Point } from '../types';
import {LatLngLiteral} from "leaflet";

export function PairPointAreEquals(point1: Pair, point2: Point): boolean {
  return point1[0] === point2.x && point1[1] === point2.y;
}

export function PairAreEquals(point1: Pair, point2: Pair): boolean {
  return point1[0] === point2[0] && point1[1] === point2[1];
}

export function PointsAreEquals(point1: Point, point2: Point): boolean {
  return point1.x === point2.x && point1.y === point2.y;
}

export function PolyPointsAreEquals([x1, y1]: Pair, [x2, y2]: Pair): boolean {
  return x1 === x2 && y1 === y2;
}

export function LocationsAreEquals(l1: LatLngLiteral, l2: LatLngLiteral): boolean {
  return l1.lat === l2.lat && l1.lng === l2.lng;
}
