import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ZenCrudForm, TypedFormType } from 'zen-angular/crud';

@Component({
  selector: 'app-<%= dasherize(name) %>-create-form',
  templateUrl: './<%= dasherize(name) %>-create-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>CreateFormComponent implements OnInit, ZenCrudForm<<%= classify(name) %>CreateInput> {
  form!: FormGroup;

  buildForm(): void {
    this.form = new FormGroup<TypedFormType<<%= classify(name) %>CreateInput>>({
    <% if (isMeta) { %>
      name_i18n: new FormControl<<%= classify(name) %>CreateInput['name_i18n'] | null>(null),
      description_i18n: new FormControl<<%= classify(name) %>CreateInput['description_i18n'] | null>(null),
      code: new FormControl<<%= classify(name) %>CreateInput['code'] | null>(null, Validators.required),
      isActive: new FormControl<<%= classify(name) %>CreateInput['isActive']>(true),
    <% } %>
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }
}
