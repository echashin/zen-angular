import {MultiPolygon, Pair, Polygon, Ring} from "polygon-clipping";
import {PairToPair} from "../types";

export function MapPolygonToCanvas(polygon: Polygon, toCanvasCord: PairToPair): Polygon {
  return polygon.map((ring: Ring) => ring.map((pair: Pair) => toCanvasCord(pair)));
}

export function MapMPolygonToCanvas(polygon: MultiPolygon, toCanvasCord: PairToPair): MultiPolygon {
  return polygon.map((polygon: Polygon) => MapPolygonToCanvas(polygon, toCanvasCord));
}