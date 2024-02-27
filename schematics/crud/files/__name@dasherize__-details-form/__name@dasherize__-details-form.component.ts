import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZenCrudDetailsComponent } from 'zen-angular/crud';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-<%= dasherize(name) %>-details-form',
  templateUrl: './<%= dasherize(name) %>-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>DetailsFormComponent implements ZenCrudDetailsComponent<<%= classify(name) %>Entity> {
  value$: Subject<<%= classify(name) %>Entity> = new Subject<<%= classify(name) %>Entity>();

  relations: string[] = [];

  //fields: NestedKeyOf<Required<<%= classify(name) %>Entity>>[] = [];
}
