# ZenAngular

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Code scaffolding

Run `ng generate component component-name --project zen-angular` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project zen-angular`.
> Note: Don't forget to add `--project zen-angular` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build zen-angular` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build zen-angular`, go to the dist folder `cd dist/zen-angular` and run `npm publish`.

## Running unit tests

Run `ng test zen-angular` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Crud Schematics generate
```shell
ng g zen-angular:crud --name=test --create=TestCreateInput --update=TestUpdateInput --entity=TestEntity --path=src/app/test-delete
```
```text
  "name": string, file names like "test"
  "entity": string, entity name
  "create": string, create input name
  "update": string, update input name
  "details": boolean, generate details forms
  "removeFilter": boolean, remove filter form
  "path": string, generate files to path
```

```shell
ng g zen-angular:crud-module --name=test --path=src/app/test-delete --details --isMeta
```
