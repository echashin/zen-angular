import {NgModule} from "@angular/core";
import {ImageCropComponent} from "./image-crop/image-crop.component";
import {ImageCryptComponent} from "./image-crypt/image-crypt.component";

export const components: Required<NgModule>['declarations'] = [ImageCropComponent, ImageCryptComponent];