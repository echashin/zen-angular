import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {DrawMode, EditMode, StateType} from "../../types";
import {State} from "../../states/state";

@Component({
  selector: 'zen-draw-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="controls">
      <div class="text-align-right">
        <button title="Draw Polygon (f)" [disabled]="state|canvasStateType :'draw'" (click)="onChangeState('draw')">
          <span class="icon pencil"></span>
        </button>
        <button title="Edit Polygon (g)" [disabled]="state|canvasStateType :'vector_edit'" (click)="onChangeState('vector_edit')">
          <span class="icon vector_edit"></span>
        </button>
      </div>
      <div class="text-align-right" *ngIf="state|canvasStateType :'draw' as state">
        <button title="Union Polygon (c)" [disabled]="(state.mode|async) === 'union'" (click)="onChangeMode('union')">
          <span class="icon union"></span>
        </button>
        <button title="Exclude Polygon (v)" [disabled]="(state.mode|async) === 'extract'" (click)="onChangeMode('extract')">
          <span class="icon exclude"></span>
        </button>
      </div>
      <div class="text-align-right" *ngIf="state|canvasStateType :'vector_edit' as state">
        <button title="Move Points (c)" [disabled]="(state.mode|async) !== 'remove'" (click)="onChangeMode(null)">
          <span class="icon move"></span>
        </button>
        <button title="Remove Points (v)" [disabled]="(state.mode|async) === 'remove'" (click)="onChangeMode('remove')">
          <span class="icon remove"></span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./draw-controls.component.scss'],
})
export class DrawControlsComponent {
  @Input({ required: true }) state!: State;
  @Input({ required: true }) newPolygonPoints!: number;

  @Output() changeMode: EventEmitter<DrawMode | EditMode> = new EventEmitter<DrawMode | EditMode>();
  @Output() changeState: EventEmitter<StateType> = new EventEmitter<StateType>();

  onChangeMode(mode: DrawMode | EditMode): void {
    this.changeMode.emit(mode);
  }
  onChangeState(state: StateType): void {
    this.changeState.emit(state);
  }
}
