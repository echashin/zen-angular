import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';

import {PERMISSIONS_URL} from '../tokens';
import {ApiService} from './api.service';
import {TokensService} from "./tokens.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class PermissionsRequestsService extends ApiService {
  constructor(
    override readonly http: HttpClient,
    @Inject(PERMISSIONS_URL) private readonly permissionsUrl: string[],
    private readonly tokensService: TokensService,
  ) {
    super(http);
  }

  loadPermissions = (): Observable<Set<string>> => {
    return forkJoin(
      this.permissionsUrl.map((url: string) => this.request<string[], object>(url, "GET", {}, {}, {
            accessToken: this.tokensService.getAccessToken() as string
          }
        )
      )).pipe(
        map((data: string[][]) => new Set(data.flat())));
  }

}
