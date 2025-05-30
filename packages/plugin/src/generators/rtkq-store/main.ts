import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  Tree,
  updateJson,
} from '@nx/devkit';
import {
  RtkqStoreGeneratorConfigInput,
  RtkqStoreGeneratorConfigSchema,
} from './schema';
import path from 'node:path';

function getPathDepth(relativePath: string): number {
  const normalized = path.normalize(relativePath);
  const parts = normalized.split(path.sep).filter(Boolean); // removes empty strings
  return parts.length;
}

export async function appendLineOrCreate(
  tree: Tree,
  file: string,
  lineToAdd: string
) {
  if (!tree.exists(file)) {
    tree.write(file, `${lineToAdd}\n`);
  } else {
    const content = tree.read(file, 'utf-8') ?? '';
    const lines = content.split('\n').map((line) => line.trim());

    // Add the line if it doesn't already exist
    if (!lines.includes(lineToAdd)) {
      tree.write(file, `${content.trim()}\n${lineToAdd}\n`);
    }
  }
}

export async function rtkqGenerator(
  tree: Tree,
  unsanitizedOptions: RtkqStoreGeneratorConfigInput
) {
  const options = RtkqStoreGeneratorConfigSchema.parse(unsanitizedOptions);

  addDependenciesToPackageJson(
    tree,
    {
      // Redux dependencies
      'react-redux': '^9.2.0',
      '@reduxjs/toolkit': '^2.8.2',
    },
    {
      // Redux dependencies
      '@rtk-query/codegen-openapi': '^2.0.0',
    }
  );

  await appendLineOrCreate(
    tree,
    `${options.pathToFrontend}/.gitignore`,
    '*.generated.ts'
  );

  updateJson(tree, `${options.pathToFrontend}/project.json`, (json) => {
    json.targets = json.targets || {};
    // Build dependsOn
    json.targets['build'] = {
      ...json.targets['build'],
      dependsOn: ['generate-code', ...(json.targets['build']?.dependsOn || [])],
    };
    // Gen code
    json.targets['generate-code'] = {
      executor: 'nx:run-commands',
      options: {
        cwd: '{projectRoot}',
        command: 'npx @rtk-query/codegen-openapi openapi.config.mjs',
      },
    };
    return json;
  });

  generateFiles(tree, path.join(__dirname, 'files'), options.pathToFrontend, {
    ...options,
    workspaceRoot: new Array(getPathDepth(options.pathToFrontend))
      .fill('..')
      .join('/'),
  });

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default rtkqGenerator;
