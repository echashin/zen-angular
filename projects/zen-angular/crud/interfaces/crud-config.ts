import {SelectedCrudActions} from './selected-crud-actions';

export interface CrudConfig {
  title: string;
  subTitle?: string;
  single: string;
  plural: string;
  formWidth?: number | string;
  formBundleWidth?: number | string;
  selectedActionsList?: SelectedCrudActions[];
  isDragged?: boolean;
  nzScrollX?: `${number}px` | 'auto';
  useTableHeightCalculation?: boolean;
  fixedActionColumn?: boolean;
  fixedCheckboxColumn?: boolean;
  showReloadButton?: boolean;
  patchUrlQueryFromFilterForm?: boolean;
}
