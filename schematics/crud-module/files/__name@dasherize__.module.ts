import {NgModule} from "@angular/core";
import {components} from "./components";
import {CrudModule} from "zen-angular/crud";
import {CommonModule} from "@angular/common";
import {<%= classify(name) %>RouteModule} from './<%= dasherize(name) %>-router.module';

const ngZorro: Required<NgModule>['declarations'] = []

@NgModule({
  declarations: [...components],
  imports: [<%= classify(name) %>RouteModule, CrudModule, FormModule, CommonModule, ...ngZorro, LocaleModule],
})
export default class <%= classify(name) %>Module {}
