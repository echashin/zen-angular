import { LatLngLiteral } from 'leaflet';
import { MultiPolygon, Pair, Polygon, Ring } from 'polygon-clipping';

export function polygonToPath(polygon: Polygon): LatLngLiteral[][] {
  return polygon.map((ring: Ring) => ring.map(([x, y]: Pair): LatLngLiteral => ({ lat: y, lng: x })));
}

export function mPolygonToPath(mPolygon: MultiPolygon): LatLngLiteral[][][] {
  return mPolygon.map((polygon: Polygon) => polygonToPath(polygon));
}
