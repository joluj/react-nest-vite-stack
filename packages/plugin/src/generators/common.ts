import { generateFiles, OverwriteStrategy, Tree, updateJson } from '@nx/devkit';
import path from 'node:path';

export const commonDevDependencies = {
  '@eslint/js': '^9.8.0',
  '@nx/eslint': '21.0.3',
  '@nx/eslint-plugin': '21.0.3',
  '@nx/js': '21.0.3',
  '@nx/react': '21.0.3',
  '@nx/vite': '21.0.3',
  '@nx/web': '21.0.3',
  '@swc-node/register': '~1.9.1',
  '@swc/cli': '~0.6.0',
  '@swc/core': '^1.7.26',
  '@swc/helpers': '~0.5.11',
  eslint: '^9.8.0',
  'eslint-config-prettier': '^10.0.0',
  'eslint-plugin-import': '2.31.0',
  vitest: '^3.0.0',
  tslib: '^2.3.0',
  typescript: '~5.7.2',
  'typescript-eslint': '^8.19.0',
  prettier: '^2.6.2',
  'jsonc-eslint-parser': '^2.1.0',
  vite: '^6.3.5',
};

export function setupNXPlugins(tree: Tree) {
  updateJson(tree, 'nx.json', (json) => {
    const plugins: { plugin: string; options: Record<string, string> }[] =
      json.plugins || [];

    if (!plugins.some((p) => p.plugin === '@nx/eslint')) {
      plugins.push({
        plugin: '@nx/eslint/plugin',
        options: {
          targetName: 'lint',
        },
      });
    }

    if (!plugins.some((p) => p.plugin === '@nx/vite/plugin')) {
      plugins.push({
        plugin: '@nx/vite/plugin',
        options: {
          buildTargetName: 'build',
          testTargetName: 'test',
          serveTargetName: 'serve',
          devTargetName: 'dev',
          previewTargetName: 'preview',
          serveStaticTargetName: 'serve-static',
          typecheckTargetName: 'typecheck',
          buildDepsTargetName: 'build-deps',
          watchDepsTargetName: 'watch-deps',
        },
      });
    }

    json.plugins = plugins;
    return json;
  });
}

export function addPathToTsconfig(tree: Tree, projectRoot: string) {
  updateJson(tree, 'tsconfig.json', (json) => {
    json.references = json.references || [];
    json.references.push({
      path: `./${projectRoot}`,
    });

    return json;
  });
}

export function ensureGlobalSetup(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    json.type = 'module';

    json.scripts = json.scripts || {};
    json.scripts.build =
      json.scripts.build || 'nx run-many --target=build --all --parallel';
    json.scripts.lint =
      json.scripts.lint ||
      'nx run-many --target=lint,typecheck --all --parallel';
    json.scripts.test =
      json.scripts.test ||
      'nx run-many --target=test --all --parallel --watch=false';

    return json;
  });

  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.module = 'esnext';
    json.moduleResolution = 'bundler';

    return json;
  });

  generateFiles(
    tree,
    path.join(__dirname, './workspace-files'),
    '.',
    {},
    { overwriteStrategy: OverwriteStrategy.KeepExisting }
  );
}
