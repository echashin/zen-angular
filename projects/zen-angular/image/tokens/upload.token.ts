import {InjectionToken} from "@angular/core";
import {UploadImageType} from "../types/upload-image.type";
import {of} from "rxjs";

export const UPLOAD_TOKEN: InjectionToken<UploadImageType> = new InjectionToken<UploadImageType>('UPLOAD_TOKEN', {
  factory: () => ({
    upload: () => of()
  }),
});