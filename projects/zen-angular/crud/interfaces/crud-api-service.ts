import {Observable} from 'rxjs';
import {InputError} from "./input-error";
import {Pageable} from "./pageable";
import {ImportDto} from "./import.dto";
import {ExportFileInput} from "./export-file.input";


export interface CrudApiService<E extends { id: string }, C = void, U = void> {
  isLoading$: Observable<boolean>;
  errors$: Observable<InputError[]>;

  find(query?: {
    fields?: string;
    s?: string;
    filter?: string[];
    or?: string[];
    sort?: string[];
    join?: string[];
    limit?: number;
    page?: number;
    softDelete?: boolean;
  }): Observable<Pageable & { items: E[] }>;

  findOne?(id: string, query?: { fields?: string; join?: string[]; softDelete?: boolean; }): Observable<E>;

  create?(input: C): Observable<E>;

  update?(id: string, input: U): Observable<E>;

  updateMany?(query: { ids: string[] }, input: U): Observable<number>;

  delete?(id: string): Observable<number>;

  deleteMany?(query: { ids: string[] }): Observable<number>;

  import?(formData: { file?: File }): Observable<ImportDto>;

  export?(body: ExportFileInput): Observable<File>;
}
