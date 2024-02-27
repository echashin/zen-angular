import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DeliveryZoneDrawComponent } from './components/delivery-zone-draw/delivery-zone-draw.component';
import { DeliveryZoneOsmComponent } from './components/delivery-zone-osm/delivery-zone-osm.component';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { pipes } from './pipes';
import {DrawControlsComponent} from "./components/draw-controls/draw-controls.component";

@NgModule({
  declarations: [DeliveryZoneDrawComponent, DeliveryZoneOsmComponent, MapControlsComponent, DrawControlsComponent, ...pipes],
  imports: [CommonModule, LeafletModule],
  exports: [DeliveryZoneOsmComponent],
})
export class DeliveryZonesModule {}
