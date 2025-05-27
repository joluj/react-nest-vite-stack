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
      'tailwind-merge': '^3.3.0',
      'tailwindcss-animate': '^1.0.7',
      'tw-animate-css': '^1.3.0',
      '@tailwindcss/vite': '^4.1.7',
      tailwindcss: '^4.1.7',
      'class-variance-authority': '^0.7.1',
      clsx: '^2.1.1',
      'react-router': '^7.2.0',
    },
    {
      ...commonDevDependencies,
      '@testing-library/dom': '10.4.0',
      '@testing-library/react': '16.1.0',
      '@types/react': '19.0.0',
      '@types/react-dom': '19.0.0',
      '@vitejs/plugin-react': '^4.2.0',
      '@vitejs/plugin-react-swc': '^3.5.0',
      '@vitest/coverage-v8': '^3.0.5',
      '@vitest/ui': '^3.0.0',
      autoprefixer: '^10.4.21',
      'eslint-plugin-jsx-a11y': '6.10.1',
      'eslint-plugin-react': '7.35.0',
      'eslint-plugin-react-hooks': '5.0.0',
      jsdom: '~22.1.0',
      postcss: '^8.5.3',
      sass: '^1.55.0',
      'vite-plugin-node': '^5.0.1',
      'vite-tsconfig-paths': '^5.1.4',
      vitest: '^3.0.0',
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
