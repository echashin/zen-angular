import {Observable} from 'rxjs';


import {CrudConfig} from './crud-config';
import {Pageable} from "./pageable";


export interface CustomTable<T = any>
  extends Pick<CrudConfig, 'useTableHeightCalculation' | 'nzScrollX' | 'patchUrlQueryFromFilterForm' | 'title' | 'subTitle'> {
  onFind(input: any): Observable<Pageable & { items: T[] }>;

  isLoading$: Observable<boolean>;
}
