import {ImportErrorDto} from "./import-error.dto";

export interface ImportDto {
  /*
   * Input object keys
   */
  keys: string[];

  /*
   * Validation errors
   */
  errors: ImportErrorDto[];

  /*
   * Number of rows with errors
   */
  isValid: boolean;

  /*
   * Number of rows with errors
   */
  errorCount: number;

  /*
   * Total imported rows count
   */
  successCount: number;

  /*
   * Total rows count
   */
  totalCount: number;
}
