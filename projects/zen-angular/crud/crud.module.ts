import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';

import {components} from './components';
import {CrudComponent} from './components/crud/crud.component';
import {pipes} from './pipes';
import {FormsModule} from "@angular/forms";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzImageModule} from "ng-zorro-antd/image";
import {directives} from "./directives";

const ngZorro: Required<NgModule>['declarations'] = [
  NzToolTipModule,
  NzIconModule,
  NzTableModule,
  NzButtonModule,
  NzDrawerModule,
  NzModalModule,
  NzSpinModule,
  NzDropDownModule,
  NzTagModule,
  NzUploadModule,
  NzImageModule,
  NzCollapseModule
];

@NgModule({
  declarations: [CrudComponent, ...pipes, ...components, ...directives],
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule, ...ngZorro],
  exports: [CrudComponent, ...directives],
})
export class CrudModule {
}
