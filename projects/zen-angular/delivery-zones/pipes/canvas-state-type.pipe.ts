import { Pipe, PipeTransform } from '@angular/core';

import { DrawState } from '../states/draw-state';
import { EditState } from '../states/edit-state';
import { State } from '../states/state';
import {StateType} from "../types";

@Pipe({ name: 'canvasStateType' })
export class CanvasStateTypePipe implements PipeTransform {
  transform<T extends StateType>(state: State, stateType: T): null | (T extends 'vector_edit' ? EditState : DrawState) {
    if (state instanceof EditState && stateType === 'vector_edit') {
      // @ts-ignore
      return state;
    }
    if (state instanceof DrawState && stateType === 'draw') {
      // @ts-ignore
      return state;
    }

    return null;
  }
}
