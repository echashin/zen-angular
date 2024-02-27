import { Observable } from 'rxjs';

export interface Refresher {
  refresh(token: string): Observable<any>;
}
