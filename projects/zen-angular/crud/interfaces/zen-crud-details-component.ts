import {Subject} from "rxjs";
import {TemplateRef} from "@angular/core";

export interface ZenCrudDetailsComponent<Entity extends { id: string }> {
  value$: Subject<Entity>;
  relations?: string[];
  footer?: TemplateRef<any>;
}
