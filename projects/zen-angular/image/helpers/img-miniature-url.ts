import {ImgSizeType} from "../types/img-size.type";
import {ImageRv} from "../interfaces/image.rv";


export function ImgMiniatureUrl(img?: ImageRv, size: ImgSizeType = 50): string {
  return img ? [img.serverUrl, `/${img.path}/`, img?.id, `/${size}.`, img?.ext].join('') : '';
}
