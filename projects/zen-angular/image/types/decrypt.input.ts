export interface DecryptInput {
  /**
   * colors buffer
   */
  buffer: Uint8Array,

  /**
   * decrypt key
   */
  key: string,

  /**
   * image width
   */
  width: number,

  /**
   * image height
   */
  height: number,
}