import {ThumbDto} from "../interfaces/thumb.dto";
import {Pipe, PipeTransform} from "@angular/core";
import {ImgSizeType} from "../types/img-size.type";

@Pipe({ name: 'imgThumbUrl' })
export class ImgThumbUrlPipe implements PipeTransform {
  transform(thumbs: ThumbDto[], size: ImgSizeType = 50): string {
    const thumb: ThumbDto | undefined = thumbs.find((thumb: ThumbDto) => thumb.size === size) ?? thumbs.at(-1);
    return thumb?.thumbUrl ?? 'Thumbs not found';
  }
}