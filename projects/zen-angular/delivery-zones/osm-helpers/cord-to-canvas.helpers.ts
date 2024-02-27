import * as L from 'leaflet';
import { LatLngLiteral } from 'leaflet';
import { MultiPolygon, Pair, Polygon } from 'polygon-clipping';

export function osmToCanvas(mPolygon: L.Polygon, map: L.Map): MultiPolygon {
  const geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon = mPolygon.toGeoJSON().geometry;

  return geometry.type === 'Polygon' ? [polygonToCanvas(geometry, map)] : mPolygonToCanvas(geometry, map);
}

export function osmToMPolygon(mPolygon: L.Polygon): MultiPolygon {
  const geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon = mPolygon.toGeoJSON().geometry;
  return geometry.type === 'Polygon' ? [(geometry.coordinates as [number, number][][])] : geometry.coordinates as [number, number][][][];
}

function polygonToCanvas(polygon: GeoJSON.Polygon, map: L.Map): Polygon {
  return polygonCord(polygon.coordinates, map);
}

function mPolygonToCanvas(polygon: GeoJSON.MultiPolygon, map: L.Map): MultiPolygon {
  return polygon.coordinates.map((cord: GeoJSON.Position[][]) => {
    return polygonCord(cord, map);
  });
}

function polygonCord(cord: GeoJSON.Position[][], map: L.Map): Polygon {
  return cord.map((ring: GeoJSON.Position[]) => {
    return ring.map((pair: GeoJSON.Position) => {
      return lMapCordToCanvasPoint({ lng: pair[0], lat: pair[1] }, map);
    });
  });
}

export function lMapCordToCanvasPoint(cord: LatLngLiteral, map: L.Map): Pair {
  const point: L.Point = map.latLngToContainerPoint(cord);

  return [point.x, point.y];
}
