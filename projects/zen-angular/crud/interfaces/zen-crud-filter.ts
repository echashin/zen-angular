import {FormGroup} from "@angular/forms";
import {FindInput} from "./find.input";


export interface ZenCrudFilter<Out extends object = FindInput> {
  form: FormGroup;

  /**
   * @description filters mapper, transform values in needed format
   * @param value filter values from form
   */
  mapSearch(value: any): Out;
}
