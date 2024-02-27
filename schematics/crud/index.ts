import {normalize, strings} from '@angular-devkit/core';
import {
  apply,
  forEach,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Source,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {FileEntry} from "@angular-devkit/schematics/src/tree/interface";

export type Options = {
  "name": string,
  "removeFilter": boolean,
  "path": string,
  "isMeta": boolean,
  "addDetails": boolean,
}

export function crudSchematics(_options: Options): Rule {
  const { path, ...options }: Options = _options;
  const removeFiles: RegExp | null = removedFiles(_options);

  return (tree: Tree, _context: SchematicContext): ReturnType<Rule> => {

    const sourceTemplate: Source = url('./files');
    const sourceParameterizeTemplate = apply(sourceTemplate, [
        template({ ...options, ...strings }),
        move(normalize(path)),
        forEach((entry: FileEntry): FileEntry | null => {
          if (removeFiles && removeFiles.test(entry.path)) {
            return null;
          }
          return entry;
        })
      ],
    );
    return mergeWith(sourceParameterizeTemplate)(tree, _context);
  };
}

function removedFiles(options: Options): RegExp | null {
  const files: string[] = [options.removeFilter && 'filter', !options.addDetails && 'details'].filter(Boolean) as string[];
  return files.length > 0 ? new RegExp(files.join('|')) : null;
}