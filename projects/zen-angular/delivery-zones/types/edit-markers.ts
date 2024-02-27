import { Pair } from 'polygon-clipping';

export type EditMarker = {
  polygonIndex: number;
  ringIndex: number;
  pairIndex: number;
  p1: Pair;
  p2: Pair;
};

export type EditMarkerKeys = Omit<EditMarker, 'p1' | 'p2'>;
export type EditMarkerValue = Omit<EditMarker, keyof EditMarkerKeys>;

export type EditMarkersMap = Map<EditMarkerKeys, EditMarkerValue>;
