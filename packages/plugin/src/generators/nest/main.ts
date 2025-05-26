import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { NestGeneratorSchema } from './schema';
// import z from 'zod';

// const NestGeneratorSchema2 = z.object({
//   name: z.string(),
//   projectRoot: z.string().default(`libs/{name}`),
//   importName: z.string().optional(),
// })

export async function nestGenerator(tree: Tree, options: NestGeneratorSchema) {
  const projectRoot = `libs/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default nestGenerator;
