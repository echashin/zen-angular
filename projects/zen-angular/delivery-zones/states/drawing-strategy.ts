import {EventEmitter} from '@angular/core';
import {intersection, MultiPolygon as MP, Pair, Ring} from 'polygon-clipping';
import {BehaviorSubject, Subject} from 'rxjs';
import {MapMPolygonToCanvas} from '../heplers/map-polygon-to-canvas';
import {DrawMode, EditMode, StateType, ZoomCanvas} from '../types';
import {Cursor} from '../types/cursor';
import {DrawState} from './draw-state';
import {EditState} from './edit-state';
import {State} from './state';

export class DrawingStrategy {
  newZoneContext!: CanvasRenderingContext2D;
  removeZoneContext!: CanvasRenderingContext2D;
  existedZonesContext!: CanvasRenderingContext2D;

  width: number = 0;
  height: number = 0;

  existedZonesMapCord: MP = [];
  existedZonesCanvasCord: MP = [];

  newPolygonCanvasCord: MP = [];
  newPolygonMapCord: MP = [];

  removedCanvasCord: MP = [];
  removedMapCord: MP = [];

  cursor: BehaviorSubject<Cursor> = new BehaviorSubject<Cursor>('default');
  prevCursor: Cursor = 'default';
  isSpaceMapMove: boolean = false;

  activeState: State = new DrawState(this as any, 0);

  toMapCord: (pair: Pair) => Pair = (pair: Pair): Pair => pair;
  toCanvasCord: (pair: Pair) => Pair = (pair: Pair): Pair => pair;

  private readonly createPolygonColor: string = 'rgba(255,196,0,0.4)';
  private readonly existedZonesColor: string = 'rgba(161,0,255,0.5)';

  /**
   * @description space button pressed
   */
  isSpacePressed: boolean = false;

  /**
   * @description mouseDown - true; mouseUp = false
   */
  isMousePressed: boolean = false;

  isDragStarted: boolean = false;

  onCreate: EventEmitter<MP> = new EventEmitter<MP>();
  onZoom: EventEmitter<ZoomCanvas> = new EventEmitter<ZoomCanvas>();
  onMapDrag: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  onStartDrag: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  onEndDrag: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  dragMap: Subject<void> = new Subject<void>();

  states!: Record<StateType, State>;

  constructor() {
    this.states = {
      draw: new DrawState(this),
      vector_edit: new EditState(this),
    };
    this.activeState = this.states['draw'];
  }

  onClick(e: MouseEvent): void {
    if (!this.isSpacePressed && !this.isMousePressed) {
      this.activeState.onClick(e);
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.canDrag) {
      if (this.isMousePressed) {
        this.onMapDrag.emit(e);
        this.dragMap.next();
        if (this.isDragStarted) {
          this.recalculateAfterMove();
        } else {
          this.isDragStarted = true;
        }
      }
      if (this.activeState instanceof DrawState) {
        this.activeState.onMouseMove(e);
      }
    } else {
      this.activeState.onMouseMove(e);
    }
  }

  onMouseDown(e: MouseEvent): void {
    if (this.isSpacePressed) {
      this.isMousePressed = true;
      this.isDragStarted = false;
      this.onStartDrag.emit(e);
    } else {
      this.activeState.onMouseDown(e);
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (this.canDrag) {
      this.isMousePressed = false;
      this.onEndDrag.emit(e);
      this.recalculatePolygons();
      this.activeState.reDraw();
    } else {
      this.activeState.onMouseUp(e);
    }
  }

  get canDrag(): boolean {
    return this.isSpacePressed || this.isMousePressed;
  }

  onChangeMode(mode: DrawMode | EditMode): void {
    if (this.activeState instanceof DrawState) {
      this.activeState.changeMode(mode as DrawMode);
    }
    if (this.activeState instanceof EditState) {
      this.activeState.changeMode(mode as EditMode);
    }
  }

  onChangeState(state: StateType): void {
    this.activeState.beforeChangeState(state);
    this.activeState = this.states[state];
    this.clearCanvas();
    this.activeState.reDraw();
  }

  clearCanvas(): void {
    this.newZoneContext.clearRect(0, 0, this.width, this.height);
    this.removeZoneContext.clearRect(0, 0, this.width, this.height);
    this.existedZonesContext.clearRect(0, 0, this.width, this.height);
  }

  recalculateAfterMove(): void {
    this.newPolygonCanvasCord = MapMPolygonToCanvas(this.newPolygonMapCord, this.toCanvasCord);
    this.existedZonesCanvasCord = MapMPolygonToCanvas(this.existedZonesMapCord, this.toCanvasCord);

    if (this.removedCanvasCord.length > 0) {
      this.removedCanvasCord = MapMPolygonToCanvas(this.removedMapCord, this.toCanvasCord);
    }
    this.activeState.recalculateAfterMove();
    this.activeState.reDraw();
  }

  recalculatePolygons(): void {
    this.existedZonesCanvasCord = MapMPolygonToCanvas(this.existedZonesMapCord, this.toCanvasCord);
    this.newPolygonCanvasCord = MapMPolygonToCanvas(this.newPolygonMapCord, this.toCanvasCord);
    this.updateRemovedZone();
  }

  updateRemovedZone(): void {
    if (this.newPolygonCanvasCord.length === 0) {
      this.removedMapCord = [];
      this.removedCanvasCord = [];
      return;
    }
    this.removedCanvasCord = intersection(this.newPolygonCanvasCord, this.existedZonesCanvasCord);
  }

  drawCreatedMPolygon(): void {
    for (const polygon of this.newPolygonCanvasCord) {
      this.fillColorRing(polygon[0], this.createPolygonColor, this.newZoneContext);

      for (const ring of polygon.slice(1)) {
        this.clearColorRing(ring, this.newZoneContext);
      }
    }
  }

  drawExistDeliveryZones(): void {
    for (const polygon of this.existedZonesCanvasCord) {
      this.fillColorRing(polygon[0], this.existedZonesColor, this.existedZonesContext);

      const mainPolygon: Ring = polygon[0];

      for (const ring of polygon.slice(1)) {
        const cleared: Ring = intersection([mainPolygon], [ring])[0][0];
        this.clearColorRing(cleared, this.existedZonesContext);
      }
    }
  }

  drawRemovedZone(): void {
    for (const polygon of this.removedCanvasCord) {
      this.fillColorRing(polygon[0], 'rgba(255,0,0,0.6)', this.removeZoneContext);

      const mainPolygon: Ring = polygon[0];

      for (const ring of polygon.slice(1)) {
        const cleared: Ring = intersection([mainPolygon], [ring])[0][0];
        this.clearColorRing(cleared, this.removeZoneContext);
      }
    }
  }

  fillColorRing(ring: Ring, color: string = 'rgba(99,173,77,0.5)', context: CanvasRenderingContext2D): void {
    const path: Path2D = new Path2D();
    path.moveTo(...ring[0]);
    for (const point of ring.slice(1)) {
      path.lineTo(...point);
    }
    path.closePath();

    context.fillStyle = color;
    context.fill(path);
  }

  clearColorRing(ring: Ring, context: CanvasRenderingContext2D): void {
    const path: Path2D = new Path2D();
    path.moveTo(...ring[0]);
    for (const point of ring.slice(1)) {
      path.lineTo(...point);
    }
    path.closePath();

    context.fillStyle = 'black';
    context.globalCompositeOperation = 'destination-out';
    context.fill(path);
    context.globalCompositeOperation = 'source-over';
  }

  setCursor(cursor: Cursor): void {
    this.cursor.next(cursor);
  }
}
