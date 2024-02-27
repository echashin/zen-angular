import {NgModule} from "@angular/core";
import {ZenCrudCreateForm} from "./zen-crud-create-form.directive";
import {ZenCrudUpdateForm} from "./zen-crud-update-form.directive";
import {ZenCrudFilterForm} from "./zen-crud-filter-form.directive";
import {ZenCrudUpdateManyForm} from "./zen-crud-update-many-form.directive";
import {ZenCrudDetails} from "./zen-crud-details-form.directive";

export const directives: Required<NgModule>['declarations'] = [
  ZenCrudCreateForm, ZenCrudUpdateForm, ZenCrudFilterForm, ZenCrudDetails, ZenCrudUpdateManyForm
]
