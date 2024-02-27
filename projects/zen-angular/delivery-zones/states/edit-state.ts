import {Pair, Polygon} from 'polygon-clipping';
import {State} from './state';
import {EditMarker, EditMarkerKeys, EditMarkersMap, EditMarkerValue, EditMode, StateType} from "../types";
import {isInsideRect, isPointInPolygon, RemovePointFromMPolygon} from "../heplers";
import {DistanceAndNormalPointForPolygon} from "../heplers/closest-line";
import {PointWithDistancePolygon} from "../types/point-with-distance";
import {BehaviorSubject, Observable} from "rxjs";
import {DrawingStrategy} from "./drawing-strategy";

export class EditState implements State {
  private readonly maxDistanceForNewPoint: number = 5;
  readonly stateType: StateType = 'vector_edit';
  activePolygonIndex: number | null = null;
  readonly drawing: DrawingStrategy;

  private readonly editorControlSize: number = 6;
  private readonly halfSize: number = this.editorControlSize / 2;

  editMarkers: EditMarkersMap = new Map<EditMarkerKeys, EditMarkerValue>();
  hoverMarker: EditMarkerKeys | null = null;
  addPolygonPosition: PointWithDistancePolygon | null = null;
  isMoved: boolean = false;
  moveMarkerMousePoint: Pair | null = null;

  private _mode: BehaviorSubject<EditMode> = new BehaviorSubject<EditMode>('move');
  readonly mode: Observable<EditMode> = this._mode.asObservable();

  onCKeyDown(): void {
    this._mode.next(null);
    if (this.hoverMarker) {
      this.drawing.setCursor('move');
    }

    if (this.activePolygonIndex !== null && this.moveMarkerMousePoint && this.hoverMarker === null) {
      this.addPolygonPosition = this.detectAddPolygon(this.drawing.newPolygonCanvasCord[this.activePolygonIndex], [
        this.moveMarkerMousePoint[0],
        this.moveMarkerMousePoint[1]
      ]);

      if (this.addPolygonPosition) {
        this.reDraw();
      }
    }
  }

  onVKeyDown(): void {
    this._mode.next('remove');
    if (this.hoverMarker) {
      this.drawing.setCursor('edit_remove_point')
    } else {
      this.drawing.setCursor('default');
    }
    this.addPolygonPosition = null;
    this.reDraw();
  }

  constructor(polygonDrawingComponent: DrawingStrategy) {
    this.drawing = polygonDrawingComponent;
    this._mode.next(null);
  }

  recalculateAfterMove(): void {
    for (const marker of this.editMarkers.values()) {
      marker.p1 = this.drawing.toCanvasCord(marker.p1);
      marker.p2 = this.drawing.toCanvasCord(marker.p2);
    }
    if (this.addPolygonPosition) {
      this.addPolygonPosition.point = this.drawing.toCanvasCord(this.addPolygonPosition.point);
    }
  }

  beforeChangeState(state: StateType): void {
    this._mode.next(null);
    this.activePolygonIndex = null;
    this.hoverMarker = null;
    this.addPolygonPosition = null;
    this.isMoved = false;
    this.moveMarkerMousePoint = null;
  }

  onClick(): void {
  }

  onMouseDown(e: MouseEvent): void {
    const point: Pair = [e.offsetX, e.offsetY];
    if (this.activePolygonIndex !== null && this.hoverMarker && this.editMarkers.has(this.hoverMarker)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const {p1, p2}: EditMarkerValue = this.editMarkers.get(this.hoverMarker)!;

      if (isInsideRect([p1, p2], point)) {
        const {polygonIndex, ringIndex, pairIndex}: EditMarkerKeys = this.hoverMarker;

        if (this._mode.value === 'remove') {
          this.onRemovePoint(this.hoverMarker);
        } else {
          this._mode.next('move');

          this.drawing.newPolygonCanvasCord[polygonIndex][ringIndex][pairIndex] = point;
          this.editMarkers.set(this.hoverMarker, {
            p1: [point[0] - this.halfSize, point[1] - this.halfSize],
            p2: [point[0] + this.halfSize, point[1] + this.halfSize],
          });
        }

        this.reDraw();
        return;
      }
    }

    if (this._mode.value === null || (this._mode.value === 'remove' && !this.hoverMarker)) {
      if (this.addPolygonPosition !== null && this.activePolygonIndex !== null && this._mode.value !== 'remove') {
        const {pairIndex, ringIndex, point} = this.addPolygonPosition;
        this.drawing.newPolygonMapCord[this.activePolygonIndex][ringIndex].splice(pairIndex, 0, this.drawing.toMapCord(point));
        this.drawing.newPolygonCanvasCord[this.activePolygonIndex][ringIndex].splice(pairIndex, 0, point);

        this.editMarkers.clear();
        this.setEditMarkers(this.activePolygonIndex);
        this.hoverMarker = this.detectMarkersHover(point);
        if (this.hoverMarker) {
          this.addPolygonPosition = null;
          this._mode.next('move');
        }
        this.reDraw();
      } else {
        const activeMPolygonIndex: number = this.findPolygonIndexByCord(point);

        if (activeMPolygonIndex > -1) {
          this.activePolygonIndex = activeMPolygonIndex;
          this.setActivePolygon(activeMPolygonIndex);
        } else {
          this.activePolygonIndex = null;
          this.addPolygonPosition = null;
          this.editMarkers.clear();
        }
      }

      this.reDraw();
    }
  }

  onMouseUp(): void {
    this.hoverMarker = null;
    if (this._mode.value === 'move') {
      this._mode.next(null);
    }
    this.drawing.setCursor('default')
    this.isMoved = false;
  }

  changeMode(mode: EditMode): void {
    this._mode.next(mode);
  }

  onMouseMove(e: MouseEvent): void {
    this.moveMarkerMousePoint = [e.offsetX, e.offsetY];

    switch (this._mode.value) {
      case "move": {
        if (this.hoverMarker && !this.isMoved) {
          this.isMoved = true;
          this.moveMarker();
        }
        break;
      }
      default: {
        const hasHoverBefore: boolean = Boolean(this.hoverMarker);
        this.hoverMarker = this.detectMarkersHover(this.moveMarkerMousePoint);

        if (
          this.hoverMarker === null
          && this.activePolygonIndex !== null
          && this._mode.value !== 'remove'
          && this.drawing.newPolygonCanvasCord[this.activePolygonIndex].length > 0
        ) {
          this.addPolygonPosition = this.detectAddPolygon(this.drawing.newPolygonCanvasCord[this.activePolygonIndex], [e.offsetX, e.offsetY]);
          this.reDraw();
        } else {
          this.addPolygonPosition = null;
        }

        if (this.hoverMarker || hasHoverBefore) {
          this.reDraw();
        }
      }
    }
  }

  recalculatePositions(): void {
    if (this.activePolygonIndex !== null) {
      this.editMarkers.clear();
      this.setActivePolygon(this.activePolygonIndex);
    }
  }

  moveMarker(): void {
    requestAnimationFrame(() => {
      if (this._mode.value === 'move' && this.hoverMarker && this.moveMarkerMousePoint) {
        this.onMarkerMove(this.moveMarkerMousePoint, this.hoverMarker);
        this.reDraw();
        this.moveMarker();
        this.drawing.updateRemovedZone();
      } else {
        this.isMoved = false;
      }
    });
  }

  onMarkerMove(point: Pair, editMarkerKeys: EditMarkerKeys): void {
    const {polygonIndex, ringIndex, pairIndex}: EditMarkerKeys = editMarkerKeys;

    this.drawing.newPolygonMapCord[polygonIndex][ringIndex][pairIndex] = this.drawing.toMapCord(point);
    this.drawing.newPolygonCanvasCord[polygonIndex][ringIndex][pairIndex] =
      this.drawing.toCanvasCord(this.drawing.newPolygonMapCord[polygonIndex][ringIndex][pairIndex]);

    this.editMarkers.set(editMarkerKeys, {
      p1: [point[0] - this.halfSize, point[1] - this.halfSize],
      p2: [point[0] + this.halfSize, point[1] + this.halfSize],
    });
  }

  reDraw(): void {
    this.drawing.clearCanvas();
    this.drawing.drawCreatedMPolygon();
    this.drawing.drawExistDeliveryZones();
    this.drawing.drawRemovedZone();
    this.drawAddPolygonMarker();
    this.drawEditMarkers();
  }

  drawEditMarkers(): void {
    if (this.activePolygonIndex !== null && this.drawing.newPolygonCanvasCord[this.activePolygonIndex]) {
      const editPolygon: Polygon = this.drawing.newPolygonCanvasCord[this.activePolygonIndex];
      for (const [ringIndex, ring] of editPolygon.entries()) {
        for (const [pairIndex, [x, y]] of ring.entries()) {
          const isHovered: boolean = this.isEditMakerHovered({
            ringIndex,
            polygonIndex: this.activePolygonIndex,
            pairIndex,
          });

          if (isHovered) {
            this.drawing.newZoneContext.strokeStyle = 'rgba(255,204,0, 1)';
            this.drawing.newZoneContext.fillStyle = 'rgba(197,255,0, 1)';
            this.detectCursorOnHoverMarker();
          } else {
            this.drawing.newZoneContext.strokeStyle = 'rgba(255,0,0,0.5)';
            this.drawing.newZoneContext.fillStyle = 'rgba(145,94,0,1)';
          }

          this.drawing.newZoneContext.lineWidth = 0.5;
          this.drawing.newZoneContext.strokeRect(x - this.halfSize, y - this.halfSize, this.editorControlSize, this.editorControlSize);
          this.drawing.newZoneContext.fillRect(x - this.halfSize, y - this.halfSize, this.editorControlSize, this.editorControlSize);

          /**
           * use this for debug markers by index
           * it will help
           */
          // this.component.context.strokeStyle = 'rgb(0,0,0)';
          // this.component.context.font = "48px serif";
          // this.component.context.fillText(`${pairIndex}`, x - this.halfSize, y - this.halfSize, 50);
        }
      }
    }
  }

  drawAddPolygonMarker(): void {
    if (this.addPolygonPosition) {
      this.drawing.setCursor('edit_add_point')
      this.drawing.newZoneContext.strokeStyle = 'rgb(3,42,236)';
      this.drawing.newZoneContext.strokeRect(
        this.addPolygonPosition.point[0] - this.halfSize,
        this.addPolygonPosition.point[1] - this.halfSize,
        this.editorControlSize,
        this.editorControlSize,
      )
    }
  }

  detectCursorOnHoverMarker(): void {
    switch (this._mode.value) {
      case 'remove': {
        this.drawing.setCursor('edit_remove_point');
        break;
      }
      case 'move':
      default: {
        this.drawing.setCursor('move');
      }
    }
  }

  setActivePolygon(index: number): void {
    this.setEditMarkers(index);
  }

  setEditMarkers(index: number): void {
    for (const [ringIndex, ring] of this.drawing.newPolygonCanvasCord[index].entries()) {
      for (const [pairIndex, [x, y]] of ring.entries()) {
        this.editMarkers.set(
          {
            polygonIndex: index,
            ringIndex,
            pairIndex,
          },
          {
            p1: [x - this.halfSize, y - this.halfSize],
            p2: [x + this.halfSize, y + this.halfSize],
          },
        );
      }
    }
  }

  private onRemovePoint(markerKeys: EditMarkerKeys): void {
    RemovePointFromMPolygon(this.drawing.newPolygonCanvasCord, markerKeys);
    RemovePointFromMPolygon(this.drawing.newPolygonMapCord, markerKeys);
    this.hoverMarker = null;

    this.editMarkers.clear();

    if (this.drawing.newPolygonCanvasCord[markerKeys.polygonIndex]) {
      this.setActivePolygon(markerKeys.polygonIndex);
    } else {
      this.activePolygonIndex = null;
    }

    this.drawEditMarkers();
    this.drawing.updateRemovedZone();
  }

  /**
   * @description find multipolygon index which include point
   * @private
   */
  private findPolygonIndexByCord(point: Pair): number {
    for (const [polygonIndex, polygon] of this.drawing.newPolygonCanvasCord.entries()) {
      if (isPointInPolygon(point, polygon)) {
        return polygonIndex;
      }
    }

    return -1;
  }

  detectMarkersHover(point: Pair): EditMarkerKeys | null {
    for (const [keys, points] of this.editMarkers) {
      if (isInsideRect([points.p1, points.p2], point)) {
        return keys;
      }
    }

    this.drawing.cursor.next('default');
    return null;
  }

  detectAddPolygon(polygon: Polygon, point: Pair): PointWithDistancePolygon | null {
    return DistanceAndNormalPointForPolygon(polygon, point, this.maxDistanceForNewPoint);
  }

  private isEditMakerHovered({ringIndex, polygonIndex, pairIndex}: Omit<EditMarker, 'p1' | 'p2'>): boolean {
    return Boolean(
      this.hoverMarker &&
      this.hoverMarker.ringIndex === ringIndex &&
      this.hoverMarker.pairIndex === pairIndex &&
      this.hoverMarker.polygonIndex === polygonIndex,
    );
  }

  onCloseDraw(): void {
    this.activePolygonIndex = null;
    this.addPolygonPosition = null;
    this.editMarkers.clear();
  }
}
