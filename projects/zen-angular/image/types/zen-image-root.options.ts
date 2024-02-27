import {UploadImageType} from "./upload-image.type";

export type ZenImageRootOptions = { upload: { factory: (...args: any) => UploadImageType, inject?: any[] } }
