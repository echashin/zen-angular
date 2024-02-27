import { MultiPolygon } from 'polygon-clipping';

export type SaveZone = EditZone | CreateZone;

export type EditZone = { mp: MultiPolygon; type: 'edit'; zoneId: string };
export type CreateZone = { mp: MultiPolygon; type: 'create' };
