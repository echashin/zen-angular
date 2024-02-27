import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {ImageDecrypt} from "../../helpers";

@Component({
  selector: 'zen-image-crypt',
  templateUrl: './image-crypt.component.html',
  styleUrls: ['./image-crypt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCryptComponent {
  hasImage: boolean = false;
  imageSrc: string = '';
  private cryptKey: string|null = '';

  @Input({required: true}) set src(imageSrc: string|null) {
    this.hasImage = Boolean(imageSrc);

    if (imageSrc) {
      // re init component
      this.imageSrc = imageSrc;
      this.cryptKey = null;
    }
  }

  /**
   * @description set after keyResponse emit
   * @param cryptKey image decryptKey
   */
  @Input({required: true}) set key(cryptKey: string|null) {
    if (cryptKey && this.hasImage) {
      this.cryptKey = cryptKey;
      this.decrypt(cryptKey);
    } else {
      this.cryptKey = null;
    }
  }

  /**
   * @description "decode" button handler
   */
  @Output() keyResponse: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('image') image!: ElementRef<HTMLImageElement>;

  showDecrypt: boolean = true;

  constructor(private elRef: ElementRef<Element>) {}

  load(): void {
    this.hideOriginal();
  }

  onDecryptClick(): void {
    if (this.hasImage && this.cryptKey) {
      this.decrypt(this.cryptKey);
    } else {
      this.keyResponse.emit();
    }
  }

  decrypt(key: string): void {
    if (!this.showDecrypt) {
      this.decodeImage(key);
    }

    this.showDecrypt = true;
  }

  hideOriginal(): void {
    this.removeCanvas();
    this.showDecrypt = false;
  }

  removeCanvas(): void {
    const element: Element | null = this.elRef.nativeElement.querySelector('.decrypt-image');
    element?.remove();
  }

  decodeImage(key: string): void {
    const canvas: HTMLCanvasElement = ImageDecrypt({
      imageElement: this.image.nativeElement,
      key: key
    });

    canvas.className = 'decrypt-image'

    this.elRef.nativeElement.append(canvas);
    canvas.after(this.image.nativeElement);
  }
}
