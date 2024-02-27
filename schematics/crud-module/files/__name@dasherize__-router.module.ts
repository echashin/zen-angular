import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { <%= classify(name) %>CrudComponent } from './components/<%= dasherize(name) %>-crud/<%= dasherize(name) %>-crud.component';

const routes: Routes = [{ path: '', component: <%= classify(name) %>CrudComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class <%= classify(name) %>RouteModule {}