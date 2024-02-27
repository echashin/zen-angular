import {CellType} from "./cell.type";
import {Params} from "@angular/router";

interface CrudColumnGlobal<T> {
  label: string;
  cellType: CellType;
  sortBy?: string;
  align?: 'left' | 'right' | 'center';
  class?: string;
  fixedLeft?: boolean;
  fixedRight?: boolean;
  nzWidth?: `${number}px`;
}


interface ColumnBoolean<T> extends CrudColumnGlobal<T> {
  cellType: 'boolean';

  getValue(item: T): BooleanColumnValue;

}

export type BooleanColumnValue = {
  value: boolean;
  trueText?: string;
  falseText?: string;
}

interface ColumnText<T> extends CrudColumnGlobal<T> {
  cellType: 'text';

  getValue(item: T): string;
}

interface ColumnTextArray<T> extends CrudColumnGlobal<T> {
  cellType: 'text[]';

  getValue(item: T): string[];
}

interface ColumnTagsArray<T> extends CrudColumnGlobal<T> {
  cellType: 'tags';

  getValue(item: T): string[];
}

interface ColumnNumber<T> extends CrudColumnGlobal<T> {
  cellType: 'number';

  getValue(item: T): NumberColumnValue;
}

export type NumberColumnValue = { value: number | string, digitsInfo?: string }

interface ColumnCurrency<T> extends CrudColumnGlobal<T> {
  cellType: 'currency';

  getValue(item: T): CurrencyColumnValue;
}

export type CurrencyColumnValue = {
  value: string | number | Date
  format?: string;
  timezone?: string;
}

interface ColumnDate<T> extends CrudColumnGlobal<T> {
  cellType: 'date';

  getValue(item: T): DateColumnValue;
}

export type DateColumnValue = {
  value: string | number | Date
  format?: string;
  timezone?: string;
}

interface ColumnTime<T> extends CrudColumnGlobal<T> {
  cellType: 'time';

  getValue(item: T): TimeColumnValue;
}

export type TimeColumnValue = {
  value: string | number | Date
  format?: string;
  timezone?: string;
}

interface ColumnTimestamp<T> extends CrudColumnGlobal<T> {
  cellType: 'timestamp';

  getValue(item: T): TimestampColumnValue;
}

export type TimestampColumnValue = {
  value: string | number | Date
  format?: string;
  timezone?: string;
}

interface ColumnLink<T> extends CrudColumnGlobal<T> {
  cellType: 'link';

  getValue(item: T): LinkColumnValue,
}

export type LinkColumnValue = {
  label: string;
  href?: string;
  target?: '_self' | '_blank';
  routerLink?: string | string[];
  queryParams?: Params;
}

interface ColumnImage<T> extends CrudColumnGlobal<T> {
  cellType: 'image';

  getValue(item: T): ImageColumnValue,
}

export type ImageColumnValue = {
  srcUrl: string;
  thumbUrl: string;
  width?: string;
  height?: string;
  alt?: string;
}


export type CrudColumn<T> =
  ColumnBoolean<T>
  | ColumnText<T>
  | ColumnTextArray<T>
  | ColumnCurrency<T>
  | ColumnLink<T>
  | ColumnDate<T>
  | ColumnImage<T>
  | ColumnTime<T>
  | ColumnTimestamp<T>
  | ColumnTagsArray<T>
  | ColumnNumber<T>;
