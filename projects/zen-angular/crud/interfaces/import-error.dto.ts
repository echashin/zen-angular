import {InputError} from "./input-error";

export interface ImportErrorDto {
  /*
   * Input value
   */
  target?: object;

  /*
   * Validation errors
   */
  errors?: InputError[];
}
