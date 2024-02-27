import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ZenCrudForm, TypedFormType } from 'zen-angular/crud';

@Component({
  selector: 'app-<%= dasherize(name) %>-update-form',
  templateUrl: './<%= dasherize(name) %>-update-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>UpdateFormComponent implements OnInit, ZenCrudForm<<%= classify(name) %>UpdateInput> {
  form!: FormGroup;

  buildForm(): void {
    this.form = new FormGroup<TypedFormType<<%= classify(name) %>UpdateInput>>({
    <% if (isMeta) { %>
      name_i18n: new FormControl<<%= classify(name) %>UpdateInput['name_i18n'] | null>(null),
      description_i18n: new FormControl<<%= classify(name) %>UpdateInput['description_i18n'] | null>(null),
      code: new FormControl<<%= classify(name) %>UpdateInput['code'] | null>(null, Validators.required),
      isActive: new FormControl<<%= classify(name) %>UpdateInput['isActive']>(true),
    <% } %>
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }
}
