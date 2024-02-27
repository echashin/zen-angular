import {Pipe, PipeTransform} from "@angular/core";
import {ImgSizeType} from "../types/img-size.type";
import {ImgMiniatureUrl} from "../helpers";
import {ImageRv} from "../interfaces/image.rv";

@Pipe({ name: 'img' })
export class ImgPipe implements PipeTransform {
  transform(img: ImageRv, size: ImgSizeType = 50): string {
    return ImgMiniatureUrl(img, size);
  }
}
