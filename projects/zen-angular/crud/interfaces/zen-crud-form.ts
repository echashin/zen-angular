import {FormGroup} from "@angular/forms";
import {TypedFormType} from "../types/typed-form.type";
import {FormValue} from "./form-value";

export interface ZenCrudForm<Input extends FormValue> {
  form: FormGroup<TypedFormType<Input>>;

  defaultFormValue?: Partial<Input>;

  beforePatch?(value: any): Input;

  beforeSubmit?(value: any): Input;

  relations?: string[];
}
