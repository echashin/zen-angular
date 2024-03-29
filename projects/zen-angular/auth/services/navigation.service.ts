import { Inject, Injectable, NgZone } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, pairwise, tap } from 'rxjs/operators';

import { AUTH_PAGE_URL, HOME_PAGE_URL } from '../tokens';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly _history: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private readonly historyMaxLength: number = 4;
  get history(): string[] {
    return [...this._history.getValue()];
  }

  get currentUrl(): string {
    return this.router.url;
  }

  readonly history$: Observable<string[]> = this._history.asObservable();

  readonly navigationEnd$: Observable<NavigationEnd> = this.router.events.pipe(
    // @ts-ignore
    filter<NavigationEnd>((event: Event) => event instanceof NavigationEnd),
  );

  /**
   * Path updates with query changes
   */
  readonly pathUpdate$: Observable<NavigationEnd> = this.navigationEnd$.pipe(
    pairwise(),
    filter(([prevNavigation, currentNavigation]: [NavigationEnd, NavigationEnd]) => prevNavigation.url !== currentNavigation.url),
    map((events: [NavigationEnd, NavigationEnd]) => events[1]),
  );

  /**
   * Path updates without query changes
   */
  readonly locationUpdate$: Observable<NavigationEnd> = this.navigationEnd$.pipe(
    pairwise(),
    filter(([prevNavigation, currentNavigation]: [NavigationEnd, NavigationEnd]) => {
      return currentNavigation.url.replace(prevNavigation.url, '').charAt(0) !== '?';
    }),
    map((events: [NavigationEnd, NavigationEnd]) => events[1]),
  );

  constructor(
    private router: Router,
    private readonly ngZone: NgZone,
    @Inject(AUTH_PAGE_URL) private readonly authPageUrl: string,
    @Inject(HOME_PAGE_URL) private readonly homePageUrl: string,
  ) {
    this._history.next([...this._history.getValue(), window.location.pathname]);

    this.pathUpdate$
      .pipe(
        tap((navEnd: NavigationEnd) => {
          if (!navEnd.urlAfterRedirects.includes(this.authPageUrl)) {
            this._history.next([...this._history.getValue(), navEnd.urlAfterRedirects]);
            this.checkHistoryLength();
          }
        }),
      )
      .subscribe();
  }

  navigationAfterAuth(): void {
    const pathname: string =
      this._history
        .getValue()
        .filter((path: string) => !path.includes(this.authPageUrl))
        .pop() ?? this.homePageUrl;

    this.ngZone.run(() => this.router.navigateByUrl(pathname));
  }

  goToAuthPage(): void {
    this.ngZone.run(() => this.router.navigateByUrl(this.authPageUrl));
  }

  goBack(): void {
    const history: string[] = this._history.getValue();
    const path: string = history.pop() ?? this.homePageUrl;
    this._history.next(history);

    this.ngZone.run(() => this.router.navigateByUrl(path));
  }

  private checkHistoryLength(): void {
    const history: string[] = this._history.getValue();
    const historyLength: number = history.length;
    if (historyLength > this.historyMaxLength) {
      this._history.next(history.splice(0, historyLength - this.historyMaxLength));
    }
  }
}
