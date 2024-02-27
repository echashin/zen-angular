import {NgModule} from '@angular/core';

import {ColumnDateComponent} from './column-date/column-date.component';
import {ColumnTagsComponent} from './column-tags/column-tags.component';
import {ColumnImageComponent} from './column-image/column-image.component';
import {ImportFormComponent} from "./import-form/import-form.component";
import {ColumnBooleanComponent} from "./column-boolean/column-boolean.component";
import {ColumnLinkComponent} from "./column-link/column-link.component";
import {ColumnTimeComponent} from "./column-time/column-time.component";
import {ColumnNumberComponent} from "./column-number/column-number.component";


export const components: Required<NgModule>['declarations'] = [
  ColumnImageComponent,
  ColumnDateComponent,
  ColumnTagsComponent,
  ImportFormComponent,
  ColumnBooleanComponent,
  ColumnLinkComponent,
  ColumnImageComponent,
  ColumnTimeComponent,
  ColumnNumberComponent,
];
