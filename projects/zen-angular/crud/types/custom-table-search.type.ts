import { OrderedEnum } from '../../../api/auth/data-contracts';

export type CustomTableSearchType = {
  limit: number;
  page: number;
  fields?: string[];
  orders?: OrderedEnum[];
  search?: string;
};
