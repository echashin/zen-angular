import {Pair} from "polygon-clipping";

export interface ClosestPointMultipolygon {
  /**
   * multipolygon[index]
   */
  polygonIndex: number;
  /**
   * polygon[index]
   */
  ringIndex: number;
  /**
   * ring[index]
   */
  pairIndex: number;

  /**
   * Math.hypot(pair[0], pair[1])
   */
  length: number;

  pair: Pair;
}

export type ClosestPointRing = Pick<ClosestPointMultipolygon, 'pair' | 'length' | 'pairIndex'>;
export type ClosestPointPolygon = Pick<ClosestPointMultipolygon, 'pair' | 'length' | 'pairIndex' | 'ringIndex'>;
