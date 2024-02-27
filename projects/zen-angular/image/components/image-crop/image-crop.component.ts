import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent, ImageTransform, OutputFormat } from 'ngx-image-cropper';
import {ImageValidationTypeEnum} from "../../enums";


@Component({
  selector: 'app-image-crop',
  templateUrl: 'image-crop.component.html',
  styleUrls: ['image-crop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropComponent {
  @ViewChild('cropper') cropper!: ImageCropperComponent;
  @Input() imageFile!: File | null;

  @Input() format!: OutputFormat;
  maintainAspectRatio: boolean = false;
  aspectRatio: number = 1;
  canvasRotation: number = 0;
  transform: ImageTransform = {};

  @Input() set validationType(type: ImageValidationTypeEnum | null) {
    switch (type) {
      case ImageValidationTypeEnum.square: {
        this.maintainAspectRatio = true;
        this.aspectRatio = 1;
        break;
      }
      case ImageValidationTypeEnum.rect: {
        this.maintainAspectRatio = true;
        this.aspectRatio = 4 / 3;
        break;
      }
      default: {
        this.maintainAspectRatio = false;
        this.aspectRatio = 1;
      }
    }
  }

  @Input() set doCrop(value: symbol | null) {
    if (value) {
      const crop: ImageCroppedEvent | null = this.cropper.crop();
      if (crop) {
        this.croppedImage.emit(base64ToFile(this.preview));
      }
    }
  }

  @Output() croppedImage: EventEmitter<Blob> = new EventEmitter<Blob>();
  preview = '';

  imageCropped(event: ImageCroppedEvent): void {
    if (event.base64) {
      this.preview = event.base64;
    }
  }

  rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH: boolean = Boolean(this.transform.flipH);
    const flippedV: boolean = Boolean(this.transform.flipV);
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }
}
