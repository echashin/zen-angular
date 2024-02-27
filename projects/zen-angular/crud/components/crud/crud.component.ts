import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {NgStyleInterface} from 'ng-zorro-antd/core/types';
import {NzTableQueryParams, NzTableSortOrder} from 'ng-zorro-antd/table/src/table.types';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {debounceTime, filter, switchMap, take, tap} from 'rxjs/operators';
import {ResizableTableComponent} from '../../classes/resizable-table.component';
import {saveBlobAsFile, GetFieldFromObject} from '../../helpers';
import {CrudApiService} from '../../interfaces/crud-api-service';
import {CrudConfig} from '../../interfaces/crud-config';
import {CrudColumn} from '../../types/crud-column';
import {CrudFields} from '../../types/crud-select.type';

import {TransferFileTypeEnum} from "../../enums/transfer-file-type.enum";
import {InputError} from "../../interfaces/input-error";
import {FindInput} from "../../interfaces/find.input";
import {ImportDto} from "../../interfaces/import.dto";
import {Pageable} from "../../interfaces/pageable";
import {ZenCrudCreateForm} from "../../directives/zen-crud-create-form.directive";
import {ZenCrudUpdateForm} from "../../directives/zen-crud-update-form.directive";
import {ZenCrudFilterForm} from "../../directives/zen-crud-filter-form.directive";
import {ZenCrudDetails} from "../../directives/zen-crud-details-form.directive";
import {ZenCrudUpdateManyForm} from "../../directives/zen-crud-update-many-form.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CrudActions} from "../../interfaces/crud-actions";


@Component({
  selector: 'zen-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudComponent<E extends {
  id: string
}, C extends object = any, U extends object = any, F extends object = FindInput> extends ResizableTableComponent implements AfterContentInit {
  destroyRef: DestroyRef = inject(DestroyRef);

  private _apiService!: CrudApiService<E, C, U>;

  constructor(
    public override readonly elRef: ElementRef<HTMLElement>,
  ) {
    super(elRef);
  }

  transferFileTypeEnum: typeof TransferFileTypeEnum = TransferFileTypeEnum;

  queryNameWithEditId: string = 'edit_entity_id';

  @ViewChild('filterFormContainer') override filterFormContainer?: ElementRef;
  @ViewChild('titleContainer') override titleContainer?: ElementRef;


  override paginationContainer?: HTMLElement;

  nzBodyStyle: NgStyleInterface = {
    position: 'relative',
  };

  @Input() set reloadData(i: symbol | undefined) {
    if (i) {
      this.reloadPage();
    }
  }

  @Input() showCheckboxes: boolean = true;
  @Input() showTitle: boolean = true;
  @Input() topMargin: boolean = true;
  @Input() horizontalPadding: number = 0;
  @Input() customImportParams: Record<string, string> | undefined;
  @Input() exportFileName: string | undefined;

  @Input() set apiService(s: CrudApiService<E, C, U>) {
    this._apiService = s;
    this.isLoading$ = s.isLoading$;
    s.errors$.pipe().subscribe((error: InputError[]) => {
      switch (this.openPanel) {
        case 'create': {
          this.createForm?.setErrors(error);
          break;
        }
        case 'update': {
          this.updateForm?.setErrors(error);
          break;
        }
        case 'patchBundle': {
          //TODO update many
          break;
        }
      }
    });
  }

  @Input() set config(config: CrudConfig) {
    this.crudConfig = {
      ...this.crudConfig,
      ...config,
    };
  }

  @Input() set actions(actions: CrudActions) {
    this.crudActions = {
      ...this.crudActions,
      ...actions,
    };
  }

  @Input() set clearSelectedItems(symbol: Symbol | null) {
    if (symbol) {
      this.onClearSelection();
    }
  }

  @ContentChild(ZenCrudCreateForm<C>) createForm?: ZenCrudCreateForm<C>;
  @ContentChild(ZenCrudUpdateForm<U>) updateForm?: ZenCrudUpdateForm<U>;
  @ContentChild(ZenCrudFilterForm<any, F>) filterForm?: ZenCrudFilterForm<any, F>;
  @ContentChild(ZenCrudDetails<E>) detailForm?: ZenCrudDetails<E>;
  @ContentChild(ZenCrudUpdateManyForm<U>) updateManyForm?: ZenCrudUpdateManyForm<U>;


  @Input() fields: CrudFields<E> = [];
  @Input() relations: string[] = [];
  @Input() columns!: CrudColumn<E>[];
  @Input() nameField: string = 'name_i18n';
  @Input() isSingleSelect: boolean = false;

  @Output() filterChanges: EventEmitter<FindInput> = new EventEmitter<FindInput>();
  @Output() onAction: EventEmitter<string> = new EventEmitter<string>();

  @Input() set defaultCheckedIds(ids: string[]) {
    this.setOfChecked = new Set(ids);
  }

  override crudConfig: Required<CrudConfig> = {
    showReloadButton: true,
    isDragged: false,
    selectedActionsList: [],
    formWidth: 600,
    formBundleWidth: 600,
    single: 's',
    plural: 'p',
    title: '',
    subTitle: '',
    nzScrollX: '900px',
    useTableHeightCalculation: true,
    fixedActionColumn: true,
    fixedCheckboxColumn: true,
    patchUrlQueryFromFilterForm: true,
  };

  crudActions: CrudActions = {
    deleteOne: {
      visible: true,
      disabled: true,
    },
    create: {
      visible: true,
      disabled: true
    },
    deleteMany: {
      visible: true,
      disabled: true
    },
    import: {
      visible: true,
      disabled: true
    },
    details: {
      disabled: true,
      visible: true
    },
    export: {
      visible: true,
      disabled: true
    },
    update: {
      disabled: true,
      visible: true
    },
    updateMany: {
      visible: true,
      disabled: true
    }
  }


  init: boolean = false;
  isFindOneAllowed: boolean = false;
  isCreateAllowed: boolean = false;
  isUpdateAllowed: boolean = false;
  isUpdateManyAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isDeleteManyAllowed: boolean = false;
  isImportAllowed: boolean = false;
  isExportAllowed: boolean = false;

  startImport: symbol | undefined;
  importDto: ImportDto | null = null;

  searchSubject: BehaviorSubject<FindInput> = new BehaviorSubject<FindInput>({
    limit: 20,
    page: 1,
    fields: this.fields.join(','),
    join: this.relations,
  });

  isDeleteModalVisible: boolean = false;
  isDeleteManyModalVisible: boolean = false;


  private deletedId: string = '';
  deletedName: string = '';
  detailName: string = '';
  private updateId: string = '';
  private updateIds: string[] = [];
  total: number = 0;
  updateName: string = '';
  page: number = 1;

  //global table config
  @Input() nzPageSizeOptions: number[] = [10, 20, 30, 50, 100];
  @Input() limit: number = 20;

  @Output() totalCount: EventEmitter<number> = new EventEmitter<number>();
  @Output('checkboxes') checkboxes: EventEmitter<string[]> = new EventEmitter<string[]>();
  setOfChecked: Set<string> = new Set<string>();
  checkedPage: boolean = false;

  items: E[] = [];
  draggedStartId: string = '';
  draggedDropId: string = '';
  @Output() draggedEnd: EventEmitter<[string, string]> = new EventEmitter<[string, string]>();

  isLoading$: Observable<boolean> | undefined;

  openPanel: 'update' | 'patchBundle' | 'create' | 'import' | 'detail' | undefined;

  ngAfterContentInit(): void {
    this.subscribeOnSearchParams();

    this.isCreateAllowed = typeof this._apiService.create === 'function';
    this.isFindOneAllowed = typeof this._apiService.findOne === 'function';
    this.isUpdateAllowed = typeof this._apiService.update === 'function';
    this.isUpdateManyAllowed = typeof this._apiService.updateMany === 'function' && Boolean(this.updateManyForm);
    this.isDeleteAllowed = typeof this._apiService.delete === 'function';
    this.isDeleteManyAllowed = typeof this._apiService.deleteMany === 'function';
    this.isImportAllowed = typeof this._apiService.import === 'function';
    this.isExportAllowed = typeof this._apiService.export === 'function';
    this.queryNameWithEditId = `${this.queryNameWithEditId}_${this.crudConfig.title.toLowerCase().replace(/ /g, '_')}`;

    this.init = true;

    this.subOnFormChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resizeTable();
  }

  private createItem(input: C): void {
    if (this._apiService.create) {
      this._apiService
        .create(input)
        .pipe(take(1))
        .subscribe(() => {
          this.openPanel = undefined;
          this.reloadPage();
          this.onAction.emit('create');
        });
    }
  }

  private updateItem(input: U): void {
    if (this._apiService.update) {
      this._apiService
        .update(this.updateId, input)
        .pipe(take(1))
        .subscribe(() => {
          this.reloadPage();
          this.setOfChecked.delete(this.updateId);
          this.openPanel = undefined;
          this.onAction.emit('update');
        });
    }
  }

  private updateMany(input: U): void {
    if (this._apiService.updateMany) {
      this._apiService
        .updateMany({ids: this.updateIds}, input)
        .pipe(take(1))
        .subscribe(() => {
          this.reloadPage();
          this.setOfChecked.clear();
          this.openPanel = undefined;
          this.onAction.emit('updateMany');
        });
    }
  }

  onImport(formData: FormData): void {
    const customImportParams: Record<string, string> = this.customImportParams || {};

    for (const key of Object.keys(customImportParams)) {
      formData.append(key, customImportParams[key]);
    }

    if (this._apiService.import) {
      this._apiService
        .import(formData as any)
        .pipe(
          take(1),
          tap((response: ImportDto) => {
            this.importDto = response;
          }),
        )
        .subscribe();
    }
  }

  onClearSelection(): void {
    this.checkedPage = false;
    this.setOfChecked.clear();
    this.checkboxes.emit([]);
  }

  onExport(fileExt: TransferFileTypeEnum, exportAll: boolean = false): void {
    this._apiService.export &&
    this._apiService
      .export({
        ...(this.setOfChecked.size > 0 && !exportAll && {ids: [...this.setOfChecked]}),
        fileExt,
        ...(this.customImportParams && {...this.customImportParams}),
      })
      .pipe(
        take(1),
        tap((response: any) => {
          let blobType:string = 'application/json'
          switch (fileExt) {
            case TransferFileTypeEnum.Json:{
              blobType = 'application/json';
              break;
            }
            case TransferFileTypeEnum.Xlsx:{
              blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              break;
            }
            case TransferFileTypeEnum.Ods:{
              blobType = 'application/vnd.oasis.opendocument.spreadsheet';
              break;
            }
          }

          saveBlobAsFile(
            response,
            blobType,
            `${this.exportFileName || `${this.crudConfig.plural.replace(/ +/, '-').toLowerCase()}-export`}.${fileExt.toLowerCase()}`,
          );
        }),
      )
      .subscribe();
  }

  private filter({filter, or, s, softDelete, sort}: FindInput): void {
    const search: FindInput = {
      ...(filter && {filter}),
      ...(or && {or}),
      ...(s && {s}),
      ...(softDelete && {softDelete}),
      ...(sort && {sort}),
      page: 1,
      fields: this.fields.join(','),
      limit: this.searchSubject.getValue().limit,
      join: this.relations,
    };

    this.searchSubject.next(search);
  }

  onDelete(item: E): void {
    this.deletedId = item.id;
    const nameValue: string = GetFieldFromObject(item, this.nameField);
    if (this.nameField && nameValue) {
      this.deletedName = nameValue;
    }

    this.isDeleteModalVisible = true;
  }

  async onShowDetailForm(item: E): Promise<void> {
    this.openPanel = 'detail';

    const nameValue: string = GetFieldFromObject(item, this.nameField);
    if (this.nameField && nameValue) {
      this.detailName = nameValue;
    }

    const v: E = await this.loadEntityById(item.id, this.detailForm?.getRelations());
    this.detailForm?.setValue(v);
  }

  onOkDelete(): void {
    if (this._apiService.delete) {
      this._apiService
        .delete(this.deletedId)
        .pipe(take(1), filter(Boolean))
        .subscribe(() => {
          this.isDeleteModalVisible = false;
          this.setOfChecked.delete(this.deletedId);
          this.reloadPage();
          this.onAction.emit('delete');
        });
    }
  }

  onDeleteManyModalShow(): void {
    if (this.setOfChecked.size > 0) {
      this.isDeleteManyModalVisible = true;
    }
  }

  onOkDeleteMany(): void {
    if (this._apiService.deleteMany) {
      this._apiService.deleteMany({ids: [...this.setOfChecked.values()]}).subscribe(() => {
        this.reloadPage();
        this.checkedPage = false;
        this.isDeleteManyModalVisible = false;
        this.setOfChecked.clear();
        this.onAction.emit('deleteMany');
      });
    }
  }

  loadEntityById(id: string, relations: string[] = []): Promise<E> {
    if (this._apiService.findOne) {
      return firstValueFrom(this._apiService
        .findOne(id, {...(relations?.length && {join: relations})})
        .pipe(take(1)))
    } else {
      throw new Error('Method findOne not found in api service');
    }
  }

  onCancelDelete(): void {
    this.isDeleteModalVisible = false;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const sort: string[] = params.sort
      .flatMap(({key, value}: { key: string; value: NzTableSortOrder }): string | string[] => {
        if (key.includes(',')) {
          return !value ? '' : key.split(',').map((field: string) => `${field},${value === 'ascend' ? 'ASC' : 'DESC'}`);
        }
        return value ? `${key},${value === 'ascend' ? 'ASC' : 'DESC'}` : '';
      })
      .filter((v: string) => v !== '');

    const search: FindInput = {
      ...this.searchSubject.getValue(),
      ...(sort.length > 0 && {sort}),
      page: params.pageIndex,
      limit: params.pageSize,
      fields: this.fields.join(','),
      join: this.relations,
    };
    this.limit = params.pageSize;
    this.searchSubject.next(search);
  }

  subscribeOnSearchParams(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        tap((findInput: FindInput) => {
          this.filterChanges.emit(findInput);
        }),
        switchMap((findInput: FindInput): Observable<Pageable & { items: E[] }> => {
          return this._apiService.find(findInput);
        }),
      )
      .subscribe(({items, ...page}: Pageable & { items: E[] }) => {
        if (this.init) {
          this.resizeTable();
          this.init = false;
        }
        this.items = items;
        this.total = page.total;
        this.page = page.page;
        this.totalCount.emit(this.total);
      });
  }

  onShowCreateForm(): void {
    this.openPanel = 'create';
    this.createForm?.reset();
  }

  async onShowUpdateForm(item: E): Promise<void> {
    this.updateForm?.reset();
    this.openPanel = 'update';

    const nameValue: string = GetFieldFromObject(item, this.nameField);

    if (this.nameField && nameValue) {
      this.updateName = nameValue;
    }

    this.updateId = item['id'];
    const v: E = await this.loadEntityById(this.updateId, this.updateForm?.getRelations());
    this.updateForm?.setFormValue(v as unknown as U);
  }

  onShowUpdateManyForm(ids: Set<string>): void {
    if (ids.size === 0) {
      return;
    }
    this.updateManyForm?.reset();
    this.openPanel = 'patchBundle';
    this.updateIds = [...ids];
  }

  onShowImportForm(): void {
    this.openPanel = 'import';
  }

  onCreateButtonClick(): void {
    this.createForm?.submitForm();
  }

  onUpdateButtonClick(): void {
    this.updateForm?.submitForm();
  }

  onUpdateManyButtonClick(): void {
    this.updateManyForm?.submitForm();
  }

  onItemChecked(value: string, status: boolean): void {
    if (status) {
      if (this.isSingleSelect) {
        this.setOfChecked.clear();
      }
      this.setOfChecked.add(value);
    } else {
      this.setOfChecked.delete(value);
    }
    this.checkboxes.emit([...this.setOfChecked.values()]);
  }

  reloadPage(): void {
    this.searchSubject.next(this.searchSubject.getValue());
    this.setOfChecked.clear();
  }

  onAllChecked(status: boolean): void {
    if (this.isSingleSelect) {
      this.checkedPage = false;
      return;
    }

    if (status) {
      for (const v of this.items) {
        v.id && this.setOfChecked.add(v.id);
      }
    } else {
      for (const v of this.items) {
        v.id && this.setOfChecked.delete(v.id);
      }
    }
    this.checkboxes.emit([...this.setOfChecked.values()]);
  }

  onImportButtonClick(): void {
    this.startImport = Symbol('import');
  }

  onCloseDrawer(): void {
    this.openPanel = undefined;
  }

  onStartDrag(index: string): void {
    this.draggedStartId = index;
  }

  onSortPredicate = (index: number): boolean => {
    this.draggedDropId = this.items[index].id;
    return false;
  };

  onDrop(): void {
    if (this.draggedStartId !== this.draggedDropId) {
      this.draggedEnd.emit([this.draggedStartId, this.draggedDropId]);
    }
  }

  subOnFormChanges(): void {
    this.subOnCreateForm();
    this.subOnUpdateForm();
    this.subOnFilterForm();
    this.subOnUpdateManyForm();
  }

  subOnCreateForm(): void {
    if (this.createForm) {
      this.createForm.onFormSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v: C) => this.createItem(v));
    }
  }

  subOnUpdateForm(): void {
    if (this.updateForm) {
      this.updateForm.onFormSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updateData: U) => this.updateItem(updateData))
    }
  }

  subOnFilterForm(): void {
    if (this.filterForm) {
      this.filterForm.onFormValueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updateData: FindInput) => this.filter(updateData))
    }
  }

  subOnUpdateManyForm(): void {
    if (this.updateManyForm) {
      this.updateManyForm.onFormSubmit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updateData: U) => this.updateMany(updateData))
    }
  }
}
