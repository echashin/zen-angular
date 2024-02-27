import { MultiPolygon } from 'polygon-clipping';

export type MultiPolygonDataForMap = {
  zoneId: string;
  multiPolygon: MultiPolygon;
  color?: string;
  toolTipText?: string;
  popupHeaderText?: string;
};
