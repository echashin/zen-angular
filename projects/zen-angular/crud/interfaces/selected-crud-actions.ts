export interface SelectedCrudActions {
  label: string;
  noSelectionDisable?: boolean;
  action: (setOfChecked: Set<string>) => void;
}
