import {CryptInput} from "../types";
import {DecryptBuffer} from "./decrypt-buffer";
import {GetCryptBuffer} from "./get-crypt-buffer";

/**
 * @param imageElement - HTML element with crypt image
 * @param key - key for decryption
 * @return canvas with decrypt image
 */
export function ImageDecrypt({ imageElement, key }: CryptInput): HTMLCanvasElement {
  const buffer: Uint8Array = GetCryptBuffer(imageElement);
  return DecryptBuffer({
    buffer,
    key,
    width: imageElement.naturalWidth,
    height: imageElement.naturalHeight,
  })
}