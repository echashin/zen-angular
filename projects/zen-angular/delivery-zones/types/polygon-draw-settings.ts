import { MultiPolygon } from 'polygon-clipping';

export type PolygonDrawSettings = {
  height: number;
  width: number;
  zIndex: string;
  isDraw: boolean;
  polygonsOnMap: MultiPolygon;
  uncreatedMPolygon: MultiPolygon;
};
