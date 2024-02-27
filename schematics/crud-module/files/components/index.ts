import { NgModule } from "@angular/core";

import { <%= classify(name) %>CreateFormComponent } from './<%= dasherize(name) %>-create-form/<%= dasherize(name) %>-create-form.component';
import { <%= classify(name) %>CrudComponent } from './<%= dasherize(name) %>-crud/<%= dasherize(name) %>-crud.component';
<% if (addDetails) { %>
import { <%= classify(name) %>DetailsFormComponent } from './<%= dasherize(name) %>-details-form/<%= dasherize(name) %>-details-form.component';
<% } %>
import { <%= classify(name) %>FilterFormComponent } from './<%= dasherize(name) %>-filter-form/<%= dasherize(name) %>-filter-form.component';
import { <%= classify(name) %>UpdateFormComponent } from './<%= dasherize(name) %>-update-form/<%= dasherize(name) %>-update-form.component';

export const components: Required<NgModule>['declarations'] = [
  <%= classify(name) %>CrudComponent,<% if (addDetails) { %>
  <%= classify(name) %>DetailsFormComponent,<% } %>
  <%= classify(name) %>CreateFormComponent,
  <%= classify(name) %>FilterFormComponent,
  <%= classify(name) %>UpdateFormComponent
];