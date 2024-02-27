import {State} from "../states/state";
import {DrawState} from "../states/draw-state";

export function IsDrawStateGuard(state: State): state is DrawState {
  return state.stateType === 'draw';
}