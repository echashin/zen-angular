import {StateType} from '../types';
import {DrawingStrategy} from "./drawing-strategy";

export interface State {
  stateType: StateType;
  activePolygonIndex: number | null;
  readonly drawing: DrawingStrategy;
  beforeChangeState(state: StateType): void;

  onClick(e: MouseEvent): void;
  onMouseMove(e: MouseEvent): void;
  onMouseDown(e: MouseEvent): void;
  onMouseUp(e: MouseEvent): void;

  onCKeyDown(): void;
  onVKeyDown(): void;

  recalculateAfterMove(): void;

  reDraw(): void;
  recalculatePositions(): void;
}
