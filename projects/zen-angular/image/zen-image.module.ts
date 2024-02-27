import {ModuleWithProviders, NgModule} from "@angular/core";
import {controls} from "./controls";
import {ImageCropperModule} from "ngx-image-cropper";
import {CommonModule} from "@angular/common";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule} from "ng-zorro-antd/modal";
import {components} from "./components";
import {BoolPipe, ImgPipe, ImgThumbUrlPipe} from "./pipes";
import {UPLOAD_TOKEN} from "./tokens";
import {ZenImageRootOptions} from "./types";

const nzModules: NgModule['imports'] = [
  NzSpinModule,
  NzImageModule,
  NzUploadModule,
  NzIconModule,
  NzTableModule,
  NzButtonModule,
  NzModalModule,
]

@NgModule({
  declarations: [...controls, ...components, BoolPipe, ImgPipe, ImgThumbUrlPipe],
  imports: [...nzModules, ImageCropperModule, CommonModule, DragDropModule],
  exports: [...controls, ...components, BoolPipe, ImgPipe, ImgThumbUrlPipe],
})
export class ZenImageModule {
  static forRoot(options: ZenImageRootOptions ): ModuleWithProviders<ZenImageModule> {
    return {
      ngModule: ZenImageModule,
      providers: [
        { provide: UPLOAD_TOKEN, useFactory: options.upload.factory, deps: options.upload.inject }
      ]
    }
  }
}
