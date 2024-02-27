import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {PermissionsRequestsService} from "./permissions-requests.service";
import {TokensService} from "./tokens.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AclService {

  permissions: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set());

  constructor(private readonly permissionsRequestsService: PermissionsRequestsService,
              private readonly tokensService: TokensService) {
    this.getDataFromStorage();
    this.subscribeOnTokenChanges();
  }

  /**
   * @description use after permission change
   */
  loadPermissions(): Observable<Set<string>> {
    return this.permissionsRequestsService.loadPermissions()
      .pipe(tap((permissions: Set<string>) => this.setUpPermissions(permissions)))
  }

  private getDataFromStorage(): void {
    const permissions: string | null = window.localStorage.getItem('permissions');

    if (permissions) {
      this.permissions.next(new Set(JSON.parse(permissions)));
    }
  }

  private subscribeOnTokenChanges(): void {
    this.tokensService.tokensUpdated$
      .pipe(
        switchMap(() => this.permissionsRequestsService.loadPermissions())
      )
      .subscribe((permissions: Set<string>) => {
        this.setUpPermissions(permissions);
      });
  }

  private setUpPermissions(permissions: Set<string>): void {
    window.localStorage.setItem('permissions', JSON.stringify(Array.from(permissions)));
    this.permissions.next(permissions);
  }


  isAvailable(resourcePath?: string | undefined): boolean {
    if (!resourcePath) {
      return true;
    }
    return this.permissions.getValue().has(resourcePath);
  }
}
