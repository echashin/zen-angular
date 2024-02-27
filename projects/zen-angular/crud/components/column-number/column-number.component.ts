import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NumberColumnValue} from "../../types/crud-column";

@Component({
  selector: 'zen-column-number',
  templateUrl: './column-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnNumberComponent {
  @Input() value!: NumberColumnValue
}
