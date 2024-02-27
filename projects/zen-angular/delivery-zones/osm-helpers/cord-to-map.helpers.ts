import { LatLngLiteral } from 'leaflet';
import { MultiPolygon, Pair, Polygon, Ring } from 'polygon-clipping';

export function canvasMultiPolygonToMap(mp: MultiPolygon, map: L.Map): LatLngLiteral[][][] {
  return mp.map((polygon: Polygon) => canvasPolygonToMap(polygon, map));
}

export function canvasPolygonToMap(polygon: Polygon, map: L.Map): LatLngLiteral[][] {
  return polygon.map((r: Ring) => r.map((pair: Pair) => canvasPointToMapLatLng(pair, map)));
}

export function canvasMPtoMapMP(mp: MultiPolygon, map: L.Map): MultiPolygon {
  return mp.map((polygon: Polygon) => canvasPtoMapP(polygon, map));
}

export function canvasPtoMapP(polygon: Polygon, map: L.Map): Polygon {
  return polygon.map((r: Ring) => r.map((pair: Pair) => canvasPointToMapPoint(pair, map)));
}

export function canvasPointToMapLatLng(pair: Pair, map: L.Map): LatLngLiteral {
  return map.containerPointToLatLng(pair);
}

export function canvasPointToMapPoint(pair: Pair, map: L.Map): Pair {
  const { lng, lat }: LatLngLiteral = map.containerPointToLatLng(pair);
  return [lng, lat];
}
