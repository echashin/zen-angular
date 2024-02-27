import {CrudAction} from "./crud-action";

export interface CrudActions {
  create:CrudAction;
  update:CrudAction;
  updateMany:CrudAction;
  details:CrudAction;
  deleteOne:CrudAction;
  deleteMany:CrudAction;
  export:CrudAction;
  import:CrudAction;
}
