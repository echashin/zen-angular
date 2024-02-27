import {Directive, Input, TemplateRef} from '@angular/core';
import {ZenCrudDetailsComponent} from "../interfaces/zen-crud-details-component";

@Directive({
  selector: '[zenCrudDetails]'
})
export class ZenCrudDetails<E extends {
  id: string
}> {
  component!: ZenCrudDetailsComponent<E>;


  getRelations(): string[] | undefined {
    return this.component?.relations && this.component?.relations?.length > 0 ? this.component?.relations : undefined;
  }

  @Input() set zenCrudDetails(component: ZenCrudDetailsComponent<E>) {
    this.component = component;
  }


  setValue(value: E): void {
    this.component.value$.next(value);
  }


}
