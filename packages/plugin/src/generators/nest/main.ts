import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nx/devkit';
import * as path from 'node:path';
import { NestGeneratorConfigInput, NestGeneratorConfigSchema } from './schema';
import {
  addPathToTsconfig,
  commonDevDependencies,
  ensureGlobalSetup,
  setupNXPlugins,
} from '../common';

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
  addDependenciesToPackageJson(
    tree,
    {
      '@nestjs/common': '^10.0.0',
      '@nestjs/core': '^10.0.0',
      '@nestjs/platform-express': '^10.0.0',
      '@nestjs/swagger': '^8.1.1',
      '@nestjs/typeorm': '^10.0.0',
      'class-transformer': '^0.5.1',
      'class-validator': '^0.14.2',
      'reflect-metadata': '^0.1.13',
    },
    {
      ...commonDevDependencies,
      '@nestjs/schematics': '^10.0.1',
      '@nestjs/testing': '^10.0.2',
      '@nx/nest': '21.0.3',
      '@types/node': '^20.0.0',
      '@types/supertest': '^6.0.3',
      'vite-plugin-node': '^5.0.1',
      supertest: '^7.1.1',
    }
  );

  ensureGlobalSetup(tree);
  setupNXPlugins(tree);
  addPathToTsconfig(tree, options.projectRoot);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default nestGenerator;
