import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CrudColumn, CrudConfig, CrudFields} from 'zen-angular/crud';

@Component({
  selector: 'app-<%= dasherize(name) %>-crud',
  templateUrl: './<%= dasherize(name) %>-crud.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>CrudComponent {
  fields: CrudFields<<%= classify(name) %>Entity> = [];

  config: CrudConfig = {
    title: '<%= classify(name) %>',
    plural: '<%= classify(name) %>',
    single: '<%= classify(name) %>',
  };

  columns: CrudColumn<<%= classify(name) %>Entity>[] = [

  ];

  constructor(public readonly service: Crud<%= classify(name) %>Service) {}
}
