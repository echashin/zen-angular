import { ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CrudConfig } from '../interfaces/crud-config';
import { CustomTable } from '../interfaces/custom-table';

export class ResizableTableComponent {
  filterFormContainer?: ElementRef;
  titleContainer?: ElementRef;
  paginationContainer?: HTMLElement;

  nzScroll: BehaviorSubject<{ x: string; y: string }> = new BehaviorSubject<{ x: string; y: string }>({
    x: 'auto',
    y: 'auto',
  });

  crudConfig!: Required<CrudConfig> | Required<CustomTable>;

  constructor(public elRef: ElementRef<HTMLElement>) {}

  resizeTable: () => void = (): void => {
    if (!this.paginationContainer) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.paginationContainer = this.elRef.nativeElement.querySelector('.ant-table-pagination')!;
    }

    const crud_container: HTMLDivElement = this.elRef.nativeElement.querySelector('.crud-container') as HTMLDivElement;

    const styles: CSSStyleDeclaration = window.getComputedStyle(crud_container);
    const crudTopPadding: number = Number.parseFloat(styles.getPropertyValue('padding-top'));
    const crudBottomPadding: number = Number.parseFloat(styles.getPropertyValue('padding-bottom'));

    const filterContainerHeight: number = this.filterFormContainer?.nativeElement.offsetHeight;
    const titleContainerHeight: number = this.titleContainer?.nativeElement.offsetHeight;
    const paginationContainerHeight: number = (this.paginationContainer?.offsetHeight ?? 24) + 16 * 2;
    const table_headerHeight: number = (crud_container.querySelector('.ant-table-header') as HTMLDivElement).offsetHeight;

    const maxHeight: number = crud_container.offsetHeight - crudTopPadding - crudBottomPadding;
    const tableHeight: number = maxHeight - (filterContainerHeight + titleContainerHeight + paginationContainerHeight + table_headerHeight);

    this.nzScroll.next({
      x: this.crudConfig.nzScrollX,
      y: this.crudConfig.useTableHeightCalculation ? `${tableHeight}px` : 'auto',
    });
  };
}
