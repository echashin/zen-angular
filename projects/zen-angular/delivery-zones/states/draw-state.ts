import {difference, Pair, Ring, union} from 'polygon-clipping';
import {BehaviorSubject, Observable} from 'rxjs';

import {DeleteDuplicateStartEnd, isInsideRect, PairPointAreEquals} from '../heplers';
import {MapMPolygonToCanvas} from '../heplers/map-polygon-to-canvas';
import {DrawMode, Point, StateType} from '../types';
import {DrawingStrategy} from './drawing-strategy';
import {State} from './state';

export class DrawState implements State {
  readonly stateType: StateType = 'draw';
  readonly drawing: DrawingStrategy;
  private readonly editMarkerSize: number = 8;
  private readonly editMarkerHalfSize: number = this.editMarkerSize / 2;
  private closeMarkerHover: boolean = false;

  private _mode: BehaviorSubject<DrawMode> = new BehaviorSubject<DrawMode>('union');
  readonly mode: Observable<DrawMode> = this._mode.asObservable();

  onCKeyDown(): void {
    this._mode.next('union');
  }

  onVKeyDown(): void {
    this._mode.next('extract');
  }

  private drawingPolygonCanvas: Ring = [];
  private drawingPolygonMap: Ring = [];

  private previousPointCanvas: Point | null = null;
  private previousPointMap: Point | null = null;

  activePolygonIndex: number;
  mousePositionOnMove: Point | null = null;
  isDrawLineToMouse: boolean = false;

  get isPolygonDrawing(): boolean {
    return this.drawingPolygonCanvas.length > 0;
  }

  constructor(polygonDrawingComponent: DrawingStrategy, activePolygonIndex?: number | null) {
    this.drawing = polygonDrawingComponent;
    this.activePolygonIndex = activePolygonIndex ?? this.drawing.newPolygonCanvasCord.length;
    this._mode.next('union');
    this.drawing.setCursor('add');
  }

  recalculateAfterMove(): void {
    this.drawingPolygonCanvas = this.drawingPolygonMap.map((pair: Pair) => this.drawing.toCanvasCord(pair));

    if (this.previousPointCanvas && this.previousPointMap) {
      const [x, y]: Pair = this.drawing.toCanvasCord([this.previousPointMap.x, this.previousPointMap.y]);
      this.previousPointCanvas = {x, y};
    }
  }

  beforeChangeState(): void {
    this.drawing.newZoneContext.closePath();
    this.mousePositionOnMove = null;
    this.previousPointCanvas = null;
    this.previousPointMap = null;
    this.isDrawLineToMouse = false;
    this.closeMarkerHover = false;
    this.drawingPolygonCanvas = [];

    this.changeMode('union');
  }

  changeMode(mode: DrawMode): void {
    this._mode.next(mode);
  }

  onClick(): void {
  }

  onMouseDown(): void {
  }

  onMouseUp(e: MouseEvent): void {
    const onMap: Pair = this.drawing.toMapCord([e.offsetX, e.offsetY]);
    const onCanvas: Pair = [e.offsetX, e.offsetY];

    if (this.isClosePath(onCanvas)) {
      this.onClosePath();
      this.resetDraw();
    } else {
      this.addNewPoint({onCanvas, onMap});
    }

    this.reDraw();
  }

  isClosePath(onCanvas: Pair): boolean {
    return Boolean(
      this.previousPointCanvas &&
      (this.closeMarkerHover || PairPointAreEquals(onCanvas, this.previousPointCanvas)) &&
      this.drawingPolygonCanvas.length > 2,
    );
  }

  addNewPoint(newPoint: { onMap: Pair; onCanvas: Pair }): void {
    this.drawingPolygonCanvas.push(newPoint.onCanvas);
    this.drawingPolygonMap.push(newPoint.onMap);

    this.previousPointCanvas = {x: newPoint.onCanvas[0], y: newPoint.onCanvas[1]};
    this.previousPointMap = {x: newPoint.onMap[0], y: newPoint.onMap[1]};
  }

  onClosePath(): void {
    if (this._mode.value === 'union') {
      if (this.drawing.newPolygonCanvasCord.length > 0) {
        this.drawing.newPolygonMapCord = DeleteDuplicateStartEnd(union(this.drawing.newPolygonMapCord, [[this.drawingPolygonMap]]));
        this.drawing.newPolygonCanvasCord = MapMPolygonToCanvas(this.drawing.newPolygonMapCord, this.drawing.toCanvasCord);
      } else {
        this.drawing.newPolygonMapCord = [[this.drawingPolygonMap]];
        this.drawing.newPolygonCanvasCord = DeleteDuplicateStartEnd(
          MapMPolygonToCanvas(this.drawing.newPolygonMapCord, this.drawing.toCanvasCord),
        );
      }
    } else {
      if (this.drawing.newPolygonCanvasCord.length > 0) {
        this.drawing.newPolygonMapCord = DeleteDuplicateStartEnd(difference(this.drawing.newPolygonMapCord, [[this.drawingPolygonMap]]));
        this.drawing.newPolygonCanvasCord = MapMPolygonToCanvas(this.drawing.newPolygonMapCord, this.drawing.toCanvasCord);
      }
    }
  }

  resetDraw(): void {
    this.previousPointCanvas = null;
    this.previousPointMap = null;
    this.drawingPolygonCanvas = [];
    this.drawingPolygonMap = [];

    this.drawing.updateRemovedZone();
    this.drawing.setCursor('add');
  }

  cancelDraw(): void {
    this.resetDraw();
    this.reDraw();
  }

  recalculatePositions(): void {
    this.drawingPolygonCanvas = this.drawingPolygonMap.map((pair: Pair) => this.drawing.toCanvasCord(pair));
    if (this.previousPointMap) {
      const [x, y]: Pair = this.drawing.toCanvasCord([this.previousPointMap.x, this.previousPointMap.y]);
      this.previousPointCanvas = {x, y};
    }
  }

  reDraw(): void {
    this.drawing.clearCanvas();
    this.drawing.drawCreatedMPolygon();
    this.drawing.drawExistDeliveryZones();
    this.drawing.drawRemovedZone();
    this.drawCurrentPolygon();
  }

  drawCurrentPolygon(): void {
    if (this.drawingPolygonCanvas.length <= 1 || this.previousPointCanvas === null) return;

    const path: Path2D = new Path2D();
    path.moveTo(...this.drawingPolygonCanvas[0]);
    for (const point of this.drawingPolygonCanvas.slice(1)) {
      path.lineTo(...point);
    }

    const strokePath: Path2D = new Path2D(path);

    if (this.drawingPolygonCanvas.length > 2) {
      path.closePath();
      this.drawing.newZoneContext.fillStyle = this._mode.value === 'union' ? 'rgba(170,255,0,0.5)' : 'rgba(161,23,23,0.3)';
      this.drawing.newZoneContext.fill(path);
    }

    this.drawing.newZoneContext.lineWidth = 1;
    this.drawing.newZoneContext.strokeStyle = 'white';
    this.drawing.newZoneContext.stroke(strokePath);

    if (this.drawingPolygonCanvas.length > 2) {
      if (this.closeMarkerHover) {
        this.drawing.newZoneContext.fillStyle = 'rgb(148,148,148)';
        this.drawing.newZoneContext.strokeStyle = 'rgb(80,80,80)';
      } else {
        this.drawing.newZoneContext.fillStyle = 'rgb(101,101,101)';
        this.drawing.newZoneContext.strokeStyle = 'rgb(42,42,42)';
      }
      const pair: Pair = [
        this.drawingPolygonCanvas[0][0] - this.editMarkerHalfSize,
        this.drawingPolygonCanvas[0][1] - this.editMarkerHalfSize,
      ];
      this.drawing.newZoneContext.fillRect(...pair, this.editMarkerSize, this.editMarkerSize);
      this.drawing.newZoneContext.strokeRect(...pair, this.editMarkerSize, this.editMarkerSize);
    }
  }

  onMouseMove(e: MouseEvent): void {
    if (this.previousPointCanvas) {
      this.mousePositionOnMove = {x: e.offsetX, y: e.offsetY};
      if (!this.isDrawLineToMouse) {
        this.isDrawLineToMouse = true;
        this.drawActiveLine();
      }
      this.closeMarkerHover = this.detectCloseMarkerHover([e.offsetX, e.offsetY]);
      this.drawing.setCursor(this.closeMarkerHover ? 'add_close' : 'add');
    }
  }

  detectCloseMarkerHover(point: Pair): boolean {
    if (this.drawingPolygonCanvas.length > 2) {
      const p1: Pair = [
        this.drawingPolygonCanvas[0][0] - this.editMarkerHalfSize,
        this.drawingPolygonCanvas[0][1] - this.editMarkerHalfSize,
      ];
      const p2: Pair = [p1[0] + this.editMarkerSize, p1[1] + this.editMarkerSize];
      return isInsideRect([p1, p2], point);
    }
    return false;
  }

  drawActiveLine(): void {
    requestAnimationFrame(() => {
      if (this.previousPointCanvas && this.mousePositionOnMove) {
        this.reDraw();
        const line: Path2D = new Path2D();
        line.moveTo(this.previousPointCanvas.x, this.previousPointCanvas.y);
        line.lineTo(this.mousePositionOnMove.x, this.mousePositionOnMove.y);
        this.drawing.newZoneContext.lineWidth = 0.5;
        this.drawing.newZoneContext.strokeStyle = 'white';
        this.drawing.newZoneContext.stroke(line);
        this.drawActiveLine();
      } else {
        this.isDrawLineToMouse = false;
      }
    });
  }
}
