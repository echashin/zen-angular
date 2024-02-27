import {State} from "../states/state";
import {EditState} from "../states/edit-state";

export function IsEditStateGuard(state: State): state is EditState {
  return state.stateType === 'vector_edit';
}