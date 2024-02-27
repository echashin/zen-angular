import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { intersection, MultiPolygon as MP, Pair } from 'polygon-clipping';
import { Observable, Subscription } from 'rxjs';

import { DeleteDuplicateStartEnd } from '../../heplers';
import { CanvasMPolygonToMap } from '../../heplers/canvas-polygon-to-map';
import { MapMPolygonToCanvas } from '../../heplers/map-polygon-to-canvas';
import { DrawState } from '../../states/draw-state';
import { DrawingStrategy } from '../../states/drawing-strategy';
import { EditState } from '../../states/edit-state';
import { IsDrawStateGuard } from '../../type-guard/is-draw-state.guard';
import { DrawMode, EditMode, PolygonDrawSettings, StateType, ZoomCanvas } from '../../types';

@Component({
  selector: 'zen-delivery-zone-draw',
  templateUrl: 'delivery-zone-draw.component.html',
  styleUrls: ['delivery-zone-draw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryZoneDrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  @ViewChild('canvasNewZone') canvasNewZone!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasRemoveZone') canvasRemoveZone!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasExistedZones') canvasExistedZones!: ElementRef<HTMLCanvasElement>;

  private _settings!: PolygonDrawSettings;
  // eslint-disable-next-line unicorn/consistent-function-scoping
  private resizeObserver: ResizeObserver = new ResizeObserver(() => this.onResize());
  @Input() toMapCord: (pair: Pair) => Pair = (pair: Pair): Pair => pair;
  @Input() toCanvasCord: (pair: Pair) => Pair = (pair: Pair): Pair => pair;

  drawing: DrawingStrategy = new DrawingStrategy();

  @Input() set settings(settings: PolygonDrawSettings) {
    if (!settings) return;

    this.container.nativeElement.style.zIndex = settings.zIndex;

    this.setLayersWH(this.elementRef.nativeElement.clientWidth, this.elementRef.nativeElement.clientHeight);

    this._settings = settings;

    this.patchMapPolygonsToCanvas(settings);
    this.patchUncreatedPolygon(settings);
    this.reDrawAfterSettingsSet();
  }

  private patchMapPolygonsToCanvas(settings: PolygonDrawSettings): void {
    if (settings.polygonsOnMap.length > 0) {
      this.drawing.existedZonesMapCord = settings.polygonsOnMap;
      this.drawing.existedZonesCanvasCord = MapMPolygonToCanvas(this.drawing.existedZonesMapCord, this.toCanvasCord);
    } else {
      this.drawing.existedZonesMapCord = [];
      this.drawing.existedZonesCanvasCord = [];
    }
  }

  private patchUncreatedPolygon(settings: PolygonDrawSettings): void {
    this.drawing.newPolygonMapCord = settings.uncreatedMPolygon.length > 0 ? settings.uncreatedMPolygon : [];
    this.drawing.newPolygonCanvasCord = DeleteDuplicateStartEnd(MapMPolygonToCanvas(this.drawing.newPolygonMapCord, this.toCanvasCord));
  }

  private reDrawAfterSettingsSet(): void {
    if (this.drawing.newZoneContext) {
      this.drawing.updateRemovedZone();
      this.drawing.activeState.reDraw();
    }

    if (IsDrawStateGuard(this.drawing.activeState)) {
      this.drawing.activeState.resetDraw();
    }
  }

  setLayersWH(W: number, H: number): void {
    this.canvasNewZone.nativeElement.width = W;
    this.canvasNewZone.nativeElement.height = H;

    this.canvasRemoveZone.nativeElement.width = W;
    this.canvasRemoveZone.nativeElement.height = H;

    this.canvasExistedZones.nativeElement.width = W;
    this.canvasExistedZones.nativeElement.height = H;

    this.drawing.width = W;
    this.drawing.height = H;
  }

  @Input() set closeDraw(closeDraw: symbol | null) {
    if (closeDraw) {
      this.onPolygons.emit({
        drawPolygon: this.drawing.newPolygonMapCord,
      });
      if (this.drawing.activeState instanceof EditState) {
        this.drawing.activeState.onCloseDraw();
      }
    }
  }

  @Output() onPolygons: EventEmitter<{
    drawPolygon: MP;
  }> = new EventEmitter<{
    drawPolygon: MP;
  }>();

  @Output() onCreate: EventEmitter<MP> = this.drawing.onCreate;
  @Output() onZoom: EventEmitter<ZoomCanvas> = this.drawing.onZoom;
  @Output() onMapDrag: EventEmitter<MouseEvent> = this.drawing.onMapDrag;
  @Output() onStartDrag: EventEmitter<MouseEvent> = this.drawing.onStartDrag;
  @Output() onEndDrag: EventEmitter<MouseEvent> = this.drawing.onEndDrag;

  dragSub: Subscription | null = null;

  @Input() set mapMoveEnd(drag: Observable<void>) {
    this.dragSub?.unsubscribe();
    drag.subscribe(() => {
      this.drawing.recalculatePolygons();
      this.drawing.activeState.recalculatePositions();
      this.drawing.activeState.reDraw();
    });
  }

  constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.initCanvasesContexts();

    this.initBackwardCompatibilityFunctions();

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  private initCanvasesContexts(): void {
    this.drawing.newZoneContext = this.canvasNewZone.nativeElement.getContext('2d')!;
    this.drawing.removeZoneContext = this.canvasRemoveZone.nativeElement.getContext('2d')!;
    this.drawing.existedZonesContext = this.canvasExistedZones.nativeElement.getContext('2d')!;
  }

  private initBackwardCompatibilityFunctions(): void {
    this.drawing.toCanvasCord = this.toCanvasCord;
    this.drawing.toMapCord = this.toMapCord;
  }

  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.elementRef.nativeElement);
  }

  onClick(e: MouseEvent): any {
    this.drawing.onClick(e);
  }

  onMouseDown(e: MouseEvent): any {
    this.drawing.onMouseDown(e);
  }

  onMouseUp(e: MouseEvent): any {
    this.drawing.onMouseUp(e);
  }

  clearCanvas(): void {
    this.drawing.clearCanvas();
  }

  onResize(): void {
    const newWidth: number = this.elementRef.nativeElement.clientWidth;
    const newHeight: number = this.elementRef.nativeElement.clientHeight;

    this.drawing.recalculateAfterMove();

    this.setLayersWH(newWidth, newHeight);
    this.drawing.activeState.reDraw();
  }

  onScroll(e: WheelEvent): void {
    this.onZoom.emit({
      type: e.deltaY < 0 ? 'zoomIn' : 'zoomOut',
      pair: [e.offsetX, e.offsetY],
    });
    this.clearCanvas();
  }

  onCreateDeliveryZone(): void {
    const zone: MP = CanvasMPolygonToMap(
      intersection(this.drawing.newPolygonCanvasCord, this.drawing.newPolygonCanvasCord),
      this.toMapCord,
    );

    this.onCreate.emit(zone);
  }

  onChangeMode(mode: DrawMode | EditMode): void {
    this.drawing.onChangeMode(mode);
  }

  onChangeState(state: StateType): void {
    this.drawing.onChangeState(state);
  }

  get isActiveDraw(): boolean {
    return this.elementRef.nativeElement.className === 'active-draw';
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(e: MouseEvent): any {
    this.drawing.onMouseMove(e);
  }

  @HostListener('window:keydown.space', ['$event'])
  onSpace(): void {
    if (!this.drawing.isSpaceMapMove) {
      this.drawing.prevCursor = this.drawing.cursor.value;
      this.drawing.setCursor('move');
      this.drawing.isSpacePressed = true;
      this.drawing.isSpaceMapMove = true;
    }
  }

  @HostListener('window:keyup.space', ['$event'])
  onSpaceEnd(): void {
    this.drawing.setCursor(this.drawing.prevCursor);
    this.drawing.isSpacePressed = false;
    this.drawing.isSpaceMapMove = false;
  }

  @HostListener('window:keyup.c', ['$event'])
  onCKeyDown(): void {
    if (this.isActiveDraw) {
      this.drawing.activeState.onCKeyDown();
    }
  }

  @HostListener('window:keyup.v', ['$event'])
  onVKeyDown(): void {
    if (this.isActiveDraw) {
      this.drawing.activeState.onVKeyDown();
    }
  }

  @HostListener('window:keyup.f', ['$event'])
  onFKeyDown(): void {
    if (this.isActiveDraw && this.drawing.activeState instanceof EditState) {
      this.drawing.activeState = new DrawState(this.drawing);
    }
  }

  @HostListener('window:keyup.g', ['$event'])
  onGKeyDown(): void {
    if (this.isActiveDraw && this.drawing.activeState instanceof DrawState) {
      this.drawing.activeState = new EditState(this.drawing);
    }
  }

  @HostListener('window:keyup.q', ['$event'])
  onSave(): void {
    if (this.isActiveDraw) {
      this.onCreateDeliveryZone();
    }
  }

  @HostListener('window:keyup.esc', ['$event'])
  onCancelDraw(): void {
    if (this.isActiveDraw && this.drawing.activeState instanceof DrawState && this.drawing.activeState.isPolygonDrawing) {
      this.drawing.activeState.cancelDraw();
    }
  }
}
