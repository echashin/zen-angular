export class EncryptedImageRv {
  encryptedImageUrl!: string;
  blurredImageUrl!: string;
  id!: string;
  path!: string;
  ext!: string;
  serverUrl!: string;
  uploadError?: Object;
  expires?: Date;
  key!: string;
  width!: number;
  height!: number;
}
