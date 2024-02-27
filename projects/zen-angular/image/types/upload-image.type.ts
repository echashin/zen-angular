import {Observable} from "rxjs";
import {ImageDto} from "../interfaces/image.dto";

export type UploadImageType = {
  upload: (formData: { file: File }, query: { path: string }) => Observable<ImageDto>
}