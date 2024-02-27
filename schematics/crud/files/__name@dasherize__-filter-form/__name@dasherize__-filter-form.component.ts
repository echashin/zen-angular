import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {CondOperator} from 'zen-angular/crud';
import {ZenCrudFilter} from 'zen-angular/crud/interfaces/zen-crud-filter';


@Component({
  selector: 'app-<%= dasherize(name) %>-filter-form',
  templateUrl: './<%= dasherize(name) %>-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>FilterFormComponent implements ZenCrudFilter<FindInput> {
  form = new FormGroup({
    search: new FormControl<string | null>(null),
    status: new FormControl('all') as FormControl<'All' | 'Active' | 'Deactivate'>,
  });

  statuses: ('All' | 'Active' | 'Deactivate')[] = ['All', 'Active', 'Deactivate'];

  languages: string[];

  constructor(private readonly langService: TranslocoService) {
    this.languages = (
      this.langService.getAvailableLangs() as (LangDefinition & {
        id: SupportLocalesType;
      })[]
    ).map(({ id }: LangDefinition) => id.toUpperCase());
  }


  mapSearch({ search, status }: typeof this.form.value): FindInput {
    const s: any = { $and: [] };

    if (search) {
      s.$and.push({
        $or: this.languages.map((lang: string) => {
          return { [`name_i18n#${lang}`]: { [CondOperator.CONTAINS_LOW]: search } };
        }),
      });
    }

    if (status !== 'All') {
      s.$and.push({
        status: { [CondOperator.EQUALS]: status === 'Active' },
      });
    }

    return {
      ...(s.$and.length > 0 && { s: JSON.stringify(s) }),
    };
  }
}
