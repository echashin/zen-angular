import {MultiPolygon, Pair, Polygon, Ring} from "polygon-clipping";
import {PairToPair} from "../types";

export function CanvasPolygonToMap(polygon: Polygon, toMapCord: PairToPair): Polygon {
  return polygon.map((ring: Ring) => ring.map((pair: Pair) => toMapCord(pair)));
}

export function CanvasMPolygonToMap(polygon: MultiPolygon, toMapCord: PairToPair): MultiPolygon {
  return polygon.map((polygon: Polygon) => CanvasPolygonToMap(polygon, toMapCord));
}