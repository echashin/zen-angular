import { MultiPolygon, Polygon, Ring } from 'polygon-clipping';

import { PolyPointsAreEquals } from './points';

export function DeleteDuplicateStartEnd(mp: MultiPolygon): MultiPolygon {
  return mp.map((polygon: Polygon) => {
    return polygon.map((ring: Ring) => {
      return PolyPointsAreEquals(ring[0], ring[ring.length - 1]) ? ring.slice(0, -1) : ring;
    });
  });
}
