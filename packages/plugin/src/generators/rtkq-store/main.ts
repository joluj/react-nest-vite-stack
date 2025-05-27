import {
  addDependenciesToPackageJson,
  formatFiles,
  installPackagesTask,
  Tree,
  updateJson,
} from '@nx/devkit';
import {
  RtkqStoreGeneratorConfigInput,
  RtkqStoreGeneratorConfigSchema,
} from './schema';

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
    json.targets['generate-code'] = {
      executor: 'nx:run-commands',
      options: {
        cwd: '{projectRoot}',
        command: 'npx @rtk-query/codegen-openapi openapi.config.mjs',
      },
    };
    return json;
  });

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

export default rtkqGenerator;
