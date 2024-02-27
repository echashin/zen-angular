import { MultiPolygon } from 'polygon-clipping';

import { EditMarkerKeys } from '../types';

export function RemovePointFromMPolygon(multiPolygon: MultiPolygon, { polygonIndex, ringIndex, pairIndex }: EditMarkerKeys): void {

  if (multiPolygon[polygonIndex][ringIndex].length > 3) { //more than 3 points?
    multiPolygon[polygonIndex][ringIndex].splice(pairIndex, 1);
  } else {
    multiPolygon[polygonIndex].splice(ringIndex, 1); //delete ring with <=3 points

    if (multiPolygon[polygonIndex].length === 0) { // polygon is empty?
      multiPolygon.splice(polygonIndex, 1);
    }
  }
}
