import {Pipe, PipeTransform} from '@angular/core';
import {ImportErrorDto} from "../interfaces/import-error.dto";
import {InputError} from "../interfaces/input-error";



@Pipe({name: 'importErrorsFields'})
export class ImportErrorsFieldsPipe implements PipeTransform {
  transform({errors}: ImportErrorDto): string[] {
    return errors ? errors.map((err: InputError) => err.property) : [];
  }
}
