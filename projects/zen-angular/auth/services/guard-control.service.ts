import {ActivatedRoute, OnSameUrlNavigation, PRIMARY_OUTLET, Router, RunGuardsAndResolvers} from "@angular/router";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GuardControlService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  /**
   * Принудительный запуск guard-ов текущего url
   */
  forceRunCurrentGuards(): void {
    // Изменяем стратегию Router.onSameUrlNavigation на чувствительную к навигации на текущий url
    const restoreSameUrl: ReturnType<typeof this.changeSameUrlStrategy> = this.changeSameUrlStrategy(this.router, 'reload');

    // Получаем текущий ActivatedRoute для primary outlet
    const primaryRoute: ActivatedRoute = this.getLastRouteForOutlet(this.route.root, PRIMARY_OUTLET);

    // Изменяем стратегию runGuardsAndResolvers для ActivatedRoute и его предков на чувствительную к навигации на текущий url
    const restoreRunGuards: ReturnType<typeof this.changeRunGuardStrategies> = this.changeRunGuardStrategies(primaryRoute, 'always');

    // Запуск события навигации
    this.router.navigateByUrl(
      this.router.url
    ).then(() => {
      // Восстановление onSameUrlNavigation
      restoreSameUrl();
      // Восстановление runGuardsAndResolvers
      restoreRunGuards();
    });
  }

  /**
   * Изменение onSameUrlNavigation с сохранением текущего значения
   * @param router - Router, для которого осуществляется замена
   * @param strategy - новая стратегия
   * @return callback для восстановления значения
   */
  private changeSameUrlStrategy(router: Router, strategy: 'reload' | 'ignore'): () => void {
    const onSameUrlNavigation: OnSameUrlNavigation = router.onSameUrlNavigation;
    router.onSameUrlNavigation = strategy;

    return () => {
      router.onSameUrlNavigation = onSameUrlNavigation;
    }
  }

  /**
   * Получение последнего route для outlet-а
   * @param route - Route относительно которого осуществляется поиск
   * @param outlet - имя outlet-а, по которому осуществляется поиск
   * @return Текущий ActivatedRoute для заданного outlet
   */
  private getLastRouteForOutlet(route: ActivatedRoute, outlet: string): ActivatedRoute {
    if (route.children?.length) {
      return this.getLastRouteForOutlet(
        route.children.find((item: ActivatedRoute): boolean => item.outlet === outlet)!,
        outlet
      );
    } else {
      return route;
    }
  }

  /**
   * Изменение runGuardsAndResolvers для ActivatedRoute и его предков, с сохранением текущих значений
   * @param route - ActivatedRoute для которого осуществляется замена
   * @param strategy - новая стратегия
   * @return callback для восстановления значения
   */
  private changeRunGuardStrategies(route: ActivatedRoute, strategy: RunGuardsAndResolvers): () => void {
    const routeConfigs: (RunGuardsAndResolvers | null)[] = route.pathFromRoot
      .map((item: ActivatedRoute): RunGuardsAndResolvers | null => {
        if (item.routeConfig) {
          const runGuardsAndResolvers: RunGuardsAndResolvers | null = item.routeConfig.runGuardsAndResolvers ?? null;
          item.routeConfig.runGuardsAndResolvers = strategy;
          return runGuardsAndResolvers;
        } else {
          return null;
        }
      });

    return (): void => {
      route.pathFromRoot
        .forEach((item: ActivatedRoute, index: number): void => {
          if (item.routeConfig) {
            item.routeConfig.runGuardsAndResolvers = routeConfigs[index] ?? undefined;
          }
        });
    }
  }
}