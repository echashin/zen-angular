import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { LatLng, latLng, LatLngLiteral, LeafletEvent, Map, MapOptions, point, Polygon as LPolygon, polygon, tileLayer } from 'leaflet';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { difference, intersection, MultiPolygon as MP, MultiPolygon, Pair } from 'polygon-clipping';
import { Observable, Subject } from 'rxjs';

import { mPolygonToPath } from '../../heplers';
import { canvasPointToMapPoint, lMapCordToCanvasPoint, osmToMPolygon } from '../../osm-helpers';
import { MultiPolygonDataForMap, PolygonDrawSettings, SaveZone, ZoomCanvas } from '../../types';

@Component({
  selector: 'zen-delivery-zone-osm',
  templateUrl: './delivery-zone-osm.component.html',
  styleUrls: ['./delivery-zone-osm.component.scss'],
})
export class DeliveryZoneOsmComponent {
  @Input() tooltipTemplate!: TemplateRef<any>;
  @ViewChild('popup') container!: ElementRef;
  editZoneId: string | null = null;

  templateContext: any = {
    onAreaEdit: (): void => {
      this.hashedMPolygon = this.mapPolygons.splice(this.templateContext.zoneIndex, 1)[0];
      this.hashedMPolygon.remove();
      this.editZoneId = this.templateContext.zoneId;
      this.onStartDraw();
    },
    zoneId: '',
    zoneIndex: 0,
    popupHeaderText: '',
    isAreaEditable: false,
    disableText: `You cannot edit a region if you are in the process of creating a new.`,
  };

  /**
   * @description leaflet map settings
   */
  @Input() options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 19,
        detectRetina: true,
      }),
    ],
    zoom: 12,
    center: latLng(0, 0),
  };

  /**
   * @description set default map center
   */
  @Input() set mapCenter(input: LatLngLiteral) {
    setTimeout(() => {
      this.map.setView(latLng(input.lat, input.lng));
    }, 1);

    this.center = latLng(input.lat, input.lng);
  }

  @Input() set mapZoom(zoomLvl: number) {
    setTimeout(() => {
      this.map.setZoom(zoomLvl);
    }, 1);
  }

  /**
   * @default true
   */
  @InputBoolean() changeColorOnHover: boolean = true;

  center: LatLng = latLng(0, 0);
  borderColor: string = 'rgba(0,35,140,0.6)';
  borderHoverColor: string = 'rgb(255,0,0)';

  /**
   * @description emit MultiPolygon to create a new zone
   */
  @Output() onSaveZone: EventEmitter<SaveZone> = new EventEmitter<SaveZone>();

  /**
   * @description show default zones
   */
  @Input() set polygonsData(input: MultiPolygonDataForMap[] | null) {
    if (!input) return;

    if (this.mapPolygons.length > 0) {
      this.removePolygons();
      this.mapPolygons = [];
    }

    setTimeout(() => {
      for (const [zoneIndex, data] of input.entries()) {
        const pg: LPolygon = polygon(mPolygonToPath(data.multiPolygon) as any, {
          fillColor: data.color ?? 'rgb(20,239,31)',
          weight: 0.5,
          color: this.borderColor,
          interactive: true,
        }).addTo(this.map);

        this.mapPolygons.push(pg);

        if (this.container) {
          pg.bindPopup(this.container.nativeElement);
        }

        if (data.toolTipText) {
          pg.bindTooltip(`<b>${data.toolTipText}</b>`);
        }

        pg.addEventListener('click', () => {
          this.templateContext.popupHeaderText = data.popupHeaderText;
          this.templateContext.zoneId = data.zoneId;
          this.templateContext.isAreaEditable = this.hashedMPolygon === null;
          this.templateContext.zoneIndex = zoneIndex;
          this.cdr.detectChanges();
        });

        if (this.changeColorOnHover) {
          pg.addEventListener('mouseover', () => {
            pg.setStyle({ color: this.borderHoverColor });
          });

          pg.addEventListener('mouseout', () => {
            pg.setStyle({ color: this.borderColor });
          });
        }
      }
    }, 1);
  }

  @Input() set noEditPolygons(input: MultiPolygonDataForMap[] | null) {
    if (!input) return;

    this.removeNoEditPoly();
    this.createNoEditPolygons(input);
  }

  createNoEditPolygons(input: MultiPolygonDataForMap[]): void {
    for (const data of input) {
      const pg: LPolygon = polygon(mPolygonToPath(data.multiPolygon), {
        fillColor: data.color,
        weight: 0.1,
        interactive: false,
      }).addTo(this.map);

      this.noEditPoly.push(pg);
    }
  }

  hashedMPolygon: LPolygon | null = null;
  hashedRemoveZone: LPolygon | null = null;
  mapPolygons: LPolygon[] = [];
  private noEditPoly: LPolygon[] = [];

  public map!: Map;
  public zoom!: number;
  activeDraw: boolean = false;
  canvasSettings!: PolygonDrawSettings;
  mapManipulations: symbol | null = null;

  mapMoveEnd: Subject<void> = new Subject<void>();
  mapMoveEnd$: Observable<void> = this.mapMoveEnd.asObservable();

  toMapCord: (pair: Pair) => Pair = (pair: Pair): Pair => canvasPointToMapPoint(pair, this.map);
  toCanvasCord: (pair: Pair) => Pair = (pair: Pair): Pair =>
    lMapCordToCanvasPoint(
      {
        lng: pair[0],
        lat: pair[1],
      },
      this.map,
    );

  constructor(private readonly cdr: ChangeDetectorRef) {}

  onMapReady(map: Map): void {
    this.map = map;
    map.zoomControl.setPosition('bottomleft');
    setTimeout(() => {
      map.invalidateSize();
    }, 1);

    this.map.on('moveend', () => {
      this.mapMoveEnd.next();
    });

    this.map.on('zoomend', () => {
      this.mapMoveEnd.next();
    });
  }

  onMapZoomEnd(e: LeafletEvent): void {
    this.zoom = e.target.getZoom();
  }

  onStartDraw(): void {
    this.activeDraw = true;

    this.canvasSettings = {
      height: this.map.getContainer().offsetHeight,
      width: this.map.getContainer().offsetWidth,
      zIndex: '',
      isDraw: true,
      uncreatedMPolygon: this.hashedMPolygon ? osmToMPolygon(this.hashedMPolygon) : [],
      polygonsOnMap: this.getPolygonsOnMap(),
    };
    this.removePolygons();
  }

  getPolygonsOnMap(): MultiPolygon {
    return this.mapPolygons.flatMap((p: LPolygon) => osmToMPolygon(p));
  }

  onEndDraw(emitToCanvas: boolean = true): void {
    this.activeDraw = false;

    if (emitToCanvas) {
      this.mapManipulations = Symbol('close draw');
    }
  }

  removePolygons(): void {
    this.hashedMPolygon?.remove();
    this.hashedRemoveZone?.remove();

    this.hashedMPolygon = null;
    this.hashedRemoveZone = null;

    for (const p of this.mapPolygons) {
      p.remove();
    }
  }

  removeNoEditPoly(): void {
    for (const p of this.noEditPoly) {
      p.remove();
    }
  }

  showMapPolygons(): void {
    for (const p of this.mapPolygons) {
      p.addTo(this.map);
    }
  }

  savePolygonForMapManipulation({ drawPolygon }: { drawPolygon: MP }): void {
    if (drawPolygon.length === 0) {
      this.showMapPolygons();
      return;
    }

    this.hashedMPolygon?.remove();
    this.hashedRemoveZone?.remove();

    this.hashedMPolygon = polygon(mPolygonToPath(drawPolygon), {
      weight: 0.5,
      color: 'rgba(255,255,255,0.5)',
      fillColor: 'rgba(255,153,0,0.7)',
    }).addTo(this.map);

    if (this.mapPolygons.length > 0) {
      const removedZone: MP = intersection(drawPolygon, this.getPolygonsOnMap());

      this.hashedRemoveZone = polygon(mPolygonToPath(removedZone), {
        weight: 0.5,
        color: 'red',
        fillColor: 'rgba(255,0,0,0.7)',
      }).addTo(this.map);
    }

    this.showMapPolygons();
    this.onEndDraw(false);
  }

  onCreate(multiPolygon: MultiPolygon): void {
    const fixedCoordinatesAndFormat: MultiPolygon = difference(multiPolygon, this.getPolygonsOnMap());

    this.hashedMPolygon?.remove();
    this.hashedMPolygon = null;

    this.hashedRemoveZone?.remove();
    this.hashedRemoveZone = null;

    this.onEndDraw(false);

    this.onSaveZone.emit({
      mp: fixedCoordinatesAndFormat,
      ...(this.editZoneId ? { type: 'edit', zoneId: this.editZoneId } : { type: 'create' }),
    });

    this.editZoneId = null;

    this.showMapPolygons();
  }

  onZoom({ type, pair }: ZoomCanvas): void {
    const zoom: number = type === 'zoomIn' ? 1 : -1;
    this.map.setZoomAround(point(pair), this.map.getZoom() + zoom);
  }

  onStartDrag(e: MouseEvent): void {
    this.map.getContainer().dispatchEvent(new MouseEvent('mousedown', { ...e }));
  }

  onMapDrag(e: MouseEvent): void {
    this.map.getContainer().dispatchEvent(new MouseEvent('mousemove', { ...e }));
  }

  onEndDrag(e: MouseEvent): void {
    this.map.getContainer().dispatchEvent(new MouseEvent('mouseup', { ...e }));
  }
}
