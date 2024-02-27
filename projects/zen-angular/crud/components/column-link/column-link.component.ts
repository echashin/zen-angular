import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Params} from "@angular/router";

@Component({
  selector: 'zen-column-link',
  templateUrl: './column-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnLinkComponent {
  label: string | undefined;
  href: string | undefined;
  target?: '_self' | '_blank' | undefined;
  routerLink: string | string[] | undefined;
  queryParams: Params | undefined;

  @Input() set value(input: {
    label: string;
    href?: string;
    target?: '_self' | '_blank';
    routerLink?: string | string[];
    queryParams?: Params;
  }) {
    this.label = input.label;
    this.href = input.href || undefined;
    this.target = input.target || undefined;
    this.routerLink = input.routerLink || undefined;
    this.queryParams = input.queryParams || undefined;
  }


}
