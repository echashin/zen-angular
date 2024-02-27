import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ColumnBooleanDto} from "../../dto/column-boolean.dto";

@Component({
  selector: 'zen-column-boolean',
  templateUrl: './column-boolean.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnBooleanComponent {
  val: boolean | undefined;

  @Input() set value(input: ColumnBooleanDto) {
    this.val = Boolean(input?.value);
    this.trueText = input.trueText || undefined;
    this.falseText = input.falseText || undefined;
  }

  trueText: string | undefined;
  falseText: string | undefined;

}
