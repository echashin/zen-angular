import {DecryptInput} from "../types";
import {UnFlatKey} from "./un-flat-key";

/**
 * @return {HTMLCanvasElement} canvas with decrypt image
 */
export function DecryptBuffer({ buffer, key, height ,width }: DecryptInput): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

  const decodeKey: ReturnType<typeof UnFlatKey> = UnFlatKey([...atob(key)].map((char: string) => char.codePointAt(0)!), 64);
  const data: Uint8Array = ColorOffset(buffer, decodeKey, width);

  context.putImageData(new ImageData(new Uint8ClampedArray([...data]), width, height), 0, 0);
  return canvas;
}

function ColorOffset(rgba: Uint8Array, key: ReturnType<typeof UnFlatKey>, originalWidth: number, w: number = 64, h: number = 64): Uint8Array {
  let pixelNumber: number = -1;

  for (let i: number = 0; i < rgba.length; i++) {
    if (i % 4 === 0) {
      pixelNumber = pixelNumber + 1;
    }

    const x: number = (pixelNumber % originalWidth) % w;
    const y: number = (Math.floor(pixelNumber / originalWidth)) % h;

    rgba[i] = rgba[i] ^ key[y][x][i % 4];
  }

  return rgba;
}