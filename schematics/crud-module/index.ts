import {normalize, strings} from '@angular-devkit/core';
import {apply, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url,} from '@angular-devkit/schematics';
import {RunSchematicTask} from "@angular-devkit/schematics/tasks";
import * as path from "node:path";

export type Options = {
  "name": string,
  "path": string,
  "addDetails": boolean,
  "isMeta": boolean,
  "removeFilter": boolean,
}

export function crudModuleSchematics(options: Options): Rule {
  return chain([crudModule(options), crudComponents(options)]);
}

function crudModule(_options: Options): Rule {
  const { path, ...options }: Options = _options;

  return (tree: Tree, _context: SchematicContext): ReturnType<Rule> => {
    const sourceTemplate = url('./files');
    const sourceParameterizeTemplate = apply(sourceTemplate, [
        template({ ...options, ...strings }),
        move(normalize(path)),
      ],
    );

    return mergeWith(sourceParameterizeTemplate)(tree, _context);
  }
}

function crudComponents(options: Options): Rule {
  return (_, _context: SchematicContext): ReturnType<Rule> => {
    _context.addTask(new RunSchematicTask('crud', { ...options, path: path.join(options.path, 'components') }));
  }
}