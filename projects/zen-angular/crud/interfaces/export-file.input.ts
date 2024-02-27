import {TransferFileTypeEnum} from "../enums/transfer-file-type.enum";

export interface ExportFileInput {
  ids?: string[];
  fileExt: TransferFileTypeEnum;
}
