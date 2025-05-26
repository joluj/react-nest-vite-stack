import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'node:path';
import { NestGeneratorConfigInput, NestGeneratorConfigSchema } from './schema';

function getPathDepth(relativePath: string): number {
  const normalized = path.normalize(relativePath);
  const parts = normalized.split(path.sep).filter(Boolean); // removes empty strings
  return parts.length;
}

export async function nestGenerator(
  tree: Tree,
  unsanitizedOptions: NestGeneratorConfigInput
) {
  const options = NestGeneratorConfigSchema.parse(unsanitizedOptions);

  addProjectConfiguration(tree, options.name, {
    root: options.projectRoot,
    name: options.name,
    projectType: 'library',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, {
    ...options,
    workspaceRoot: new Array(getPathDepth(options.projectRoot))
      .fill('..')
      .join('/'),
  });
  await formatFiles(tree);
}

export default nestGenerator;
