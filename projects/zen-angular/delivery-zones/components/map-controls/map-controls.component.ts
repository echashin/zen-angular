import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'zen-map-controls',
  template: `
    <button *ngIf="!isDraw" (click)="start()">Draw</button>
    <button *ngIf="isDraw" (click)="end()">Preview</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block' },
})
export class MapControlsComponent {
  @Input() isDraw: boolean = false;

  @Output() onStartDraw: EventEmitter<void> = new EventEmitter<void>();
  @Output() onEndDraw: EventEmitter<void> = new EventEmitter<void>();

  start(): void {
    this.isDraw = true;
    this.onStartDraw.emit();
  }

  end(): void {
    this.isDraw = false;
    this.onEndDraw.emit();
  }
}
