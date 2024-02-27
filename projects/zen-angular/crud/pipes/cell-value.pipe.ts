import {Pipe, PipeTransform} from '@angular/core';

import {CrudColumn} from '../types/crud-column';

@Pipe({
  name: 'cellValue',
})
export class CellValuePipe implements PipeTransform {
  transform<T>(item: T, column: CrudColumn<T>): any {
    const value: unknown = column.getValue(item);
    if (typeof value === 'string') {
      return value as string;
    }
    if (typeof value === 'boolean') {
      return value as boolean;
    }

    if (typeof value === 'number') {
      return value as number;
    }

    return value;
  }
}
