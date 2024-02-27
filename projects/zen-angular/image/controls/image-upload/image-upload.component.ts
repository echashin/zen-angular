import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  Inject,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzUploadComponent, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { BehaviorSubject, Observable, Observer, Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {ImageValidationTypeEnum} from "../../enums";
import {ImageDto} from "../../interfaces/image.dto";
import {UPLOAD_TOKEN} from "../../tokens";
import {UploadImageType} from "../../types";
import {ImageRv} from "../../interfaces/image.rv";

@Component({
  selector: 'zen-image-upload',
  templateUrl: './image-upload.component.html',
  host: { class: 'd-block position-relative' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
})
export class ImageUploadComponent implements ControlValueAccessor, OnInit {
  protected destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChild('uploadComponent') uploadComponent!: NzUploadComponent;

  fileList: BehaviorSubject<(NzUploadFile & { image: ImageRv })[]> = new BehaviorSubject<
    (NzUploadFile & {
      image: ImageRv;
    })[]
  >([]);

  fileList$: Observable<(NzUploadFile & { image: ImageRv })[]> = this.fileList.asObservable();
  uploadError: string | null = null;
  @Input() isValid: boolean = true;

  @Input() title!: string;
  @Input() subTitle!: string;
  @Input() path!: string;
  @Input() multiple: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() isUseImageCrop: boolean = false;
  @Input() imageValidator: ImageValidationTypeEnum | null = null;

  isLoading: Subject<boolean> = new Subject<boolean>();
  isLoading$: Observable<boolean> = this.isLoading.asObservable();

  // crop
  showModal: boolean = false;
  imageIsCropped: Subject<boolean> = new Subject<boolean>();
  imageIsCropped$: Observable<boolean> = this.imageIsCropped.asObservable().pipe(takeUntilDestroyed(this.destroyRef), take(1));
  imageFile: File | null = null;
  croppedImage!: Blob;
  doCrop: symbol | null = null;

  constructor(
    private http: HttpClient,
    private nzImageService: NzImageService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(UPLOAD_TOKEN) private readonly uploadToken: UploadImageType,
  ) {}

  ngOnInit(): void {
    this.fileList
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((value: NzUploadFile[]) => value.map((v: NzUploadFile) => v['image'] as ImageRv)),
      )
      .subscribe((v: ImageRv[]) => {
        this.onChange(this.multiple ? v : v[0]);
      });
  }

  beforeUpload = (file: NzUploadFile): boolean | Observable<boolean> => {
    this.uploadError = null;
    return new Observable((observer: Observer<boolean>) => {
      let error: string = 'Target file not a image.';
      if (file.type?.includes('image')) {
        if (!this.isCrop()) {
          observer.next(true);
          observer.complete();
          return;
        }

        if (this.isValidImageType(file.type)) {
          this.fileChangeEvent(file);

          this.imageIsCropped$.subscribe((status: boolean) => {
            this.showModal = false;
            this.doCrop = null;
            observer.next(status);
            observer.complete();
          });
          return;
        }
        error = `Invalid image type: ${file.type}`
      }

      observer.next(false);
      this.setError(error);
      observer.complete();
    });
  };

  private isCrop(): boolean {
    return Boolean(this.isUseImageCrop || this.imageValidator);
  }

  private isValidImageType(type: string): boolean {
    return /image\/(png|jpg|jpeg|bmp|gif|tiff|webp|x-icon|vnd.microsoft.icon)/.test(type);
  }

  setError(error: string): void {
    this.uploadError = error;
    this.updateValue();
  }

  updateValue(): void {
    this.fileList.next(this.fileList.getValue());
  }

  uploadFile = (item: NzUploadXHRArgs): Subscription => {
    const formData: { file: File } = this.createFormData(item);

    // Always return a `Subscription` object, nz-upload will automatically unsubscribe at the appropriate time
    return this.uploadToken.upload(formData, { path: this.path }).subscribe({
      next: (image: ImageDto) => {
        this.updateFileList(image, item.file.name);
        this.isLoading.next(false);
      },
      error: (error: any) => {
        if (item.onError) {
          item.onError(error, item.file);
          this.isLoading.next(false);
        }
      },
    })
  };

  createFormData(item: NzUploadXHRArgs): { file: File } {
    const formData: any = new FormData();
    if (this.isUseImageCrop || this.imageValidator) {
      formData.append('file', this.croppedImage);
    } else {
      formData.append('file', item.postFile);
    }

    return formData;
  }

  updateFileList(image: ImageDto, fileName: string): void {
    const file: NzUploadFile & { image: ImageDto } = {
      uid: (this.fileList.getValue().length * -1).toString(),
      url: image.url,
      thumbUrl: image.thumbs[image.thumbs.length - 1],
      name: fileName,
      image: { ...image },
    };
    if (this.multiple) {
      this.fileList.next([...this.fileList.getValue(), file]);
    } else {
      this.fileList.next([file]);
    }
  }

  onRemove = (delFile: NzUploadFile): boolean | Observable<boolean> => {
    const newFileList: (NzUploadFile & { image: ImageRv })[] = this.fileList
      .getValue()
      .filter((file: NzUploadFile & { image: ImageRv }) => file.url !== delFile.url);
    this.fileList.next(newFileList);
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange(_: any): void {}

  writeValue(img: ImageRv | ImageRv[]): void {
    this.uploadError = null;
    if (!img) {
      this.fileList.next([]);
    } else {
      const images: ImageRv[] = Array.isArray(img) ? img : [img];

      this.fileList.next(
        images.map((image: ImageRv, index: number): NzUploadFile & { image: ImageRv } => ({
          thumbUrl: image.id ? [image.serverUrl, image.path, image.id, `50.${image.ext}`].join('/') : image.url,
          uid: image.id || (index * -1).toString(),
          url: image.url,
          name: image.id || `image-${index}`,
          image,
        })),
      );
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.errors && 'custom' in control.errors) {
      delete control.errors['custom'];
    }

    return this.uploadError ? { 'custom': this.uploadError, ...control.errors } : null;
  }

  registerOnChange(function_: any): void {
    this.onChange = function_;
  }

  registerOnTouched(): void {}

  onDrop(event: CdkDragDrop<(NzUploadFile & { image: ImageRv })[]>): void {
    const listArray: (NzUploadFile & { image: ImageRv })[] = this.fileList.getValue();
    moveItemInArray(listArray, event.previousIndex, event.currentIndex);
    this.fileList.next(listArray);
  }

  onPreview(originalUrl?: string): void {
    if (!originalUrl) {
      return;
    }
    this.nzImageService.preview(
      [
        {
          src: originalUrl,
        },
      ],
      { nzZoom: 1, nzRotate: 0 },
    );
  }

  fileChangeEvent(event: any): void {
    this.showModal = true;
    this.imageFile = event;
    this.cdr.markForCheck();
  }

  imageCropped(event: Blob): void {
    this.croppedImage = event;
    this.imageIsCropped.next(true);
  }

  onCropSave(): void {
    this.isLoading.next(true);
    this.doCrop = Symbol('crop');
    this.imageFile = null;
  }

  onCropCancel(): void {
    this.imageIsCropped.next(false);
    this.imageFile = null;
    this.isLoading.next(false);
  }
}
