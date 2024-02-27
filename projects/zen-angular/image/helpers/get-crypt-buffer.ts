/**
 * @param {HTMLImageElement} image - HTML element with image
 * @return {Uint8Array} colors buffer. Size=height * width * 4 (rgba)
 */
export function GetCryptBuffer(image: HTMLImageElement): Uint8Array {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const width: number = image.naturalWidth;
  const height: number = image.naturalHeight;

  canvas.width = width;
  canvas.height = height;

  const gl: WebGL2RenderingContext = canvas.getContext('webgl2')!;
  gl.activeTexture(gl.TEXTURE0);
  const texture: WebGLTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const framebuffer: WebGLFramebuffer = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  const buffer: Uint8Array = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

  canvas.remove();
  return buffer;
}