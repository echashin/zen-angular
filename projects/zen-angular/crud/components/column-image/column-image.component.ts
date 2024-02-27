import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'zen-column-image',
  templateUrl: './column-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnImageComponent {
  width: string = '20px';
  height: string = '20px';
  srcUrl!: string;
  thumbUrl!: string;
  alt: string = '';

  @Input() set value(input: {
    srcUrl: string;
    thumbUrl: string;
    width?: string;
    height?: string;
    alt?: string;
  }) {
    if (input.width) {
      this.width = input.width;
    }
    if (input.height) {
      this.height = input.height;
    }
    if (input.srcUrl) {
      this.srcUrl = input.srcUrl;
    }
    if (input.thumbUrl) {
      this.thumbUrl = input.thumbUrl;
    }
  }
}
