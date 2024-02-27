import { ChangeDetectionStrategy, Component, Input } from '@angular/core';




@Component({
  selector: 'zen-column-date',
  templateUrl: './column-date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDateComponent {
  val: string | undefined;
  format: string | undefined;
  timezone: string | undefined;

  @Input() set value(input: {
    value: string | number | Date | undefined
    format?: string;
    timezone?: string;
  }) {
      if(input.value) {
        this.val = `${input.value}`;
      }
  }



}
