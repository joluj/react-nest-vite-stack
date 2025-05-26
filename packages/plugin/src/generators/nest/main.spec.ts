import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { nestGenerator } from './main';
import { NestGeneratorConfigInput } from './schema';
import { describe, it, beforeEach, expect } from 'vitest';

describe('nest generator', () => {
  let tree: Tree;
  const options: NestGeneratorConfigInput = {
    name: 'my-test-project',
    projectRoot: 'TEST-PROJECT-ROOT',
    importName: '@some-org/test',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await nestGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'my-test-project');

    expect(config).toBeDefined();
    expect(config.root).toBe(options.projectRoot);
    expect(
      tree.read(`${options.projectRoot}/package.json`)?.toString()
    ).toContain(`"name": "${options.importName}"`);
  });

  describe('optional properties', () => {
    it('should set default projectRoot if not provided', async () => {
      const optionsWithoutRoot: NestGeneratorConfigInput = {
        name: 'my-test-project',
      };
      await nestGenerator(tree, optionsWithoutRoot);
      const config = readProjectConfiguration(tree, 'my-test-project');
      expect(config.root).toBe('apps/my-test-project');
    });

    it('should set default importName if not provided', async () => {
      const optionsWithoutImportName: NestGeneratorConfigInput = {
        name: 'my-test-project',
        projectRoot: 'libs/some-other-project-root',
      };
      await nestGenerator(tree, optionsWithoutImportName);
      expect(
        tree.read('libs/some-other-project-root/package.json')?.toString()
      ).toContain('"name": "my-test-project"');
    });
  });

  describe('relative paths', () => {
    it('should handle one level deep projects', async () => {
      const optionsWithOneLevel = {
        name: 'my-test-project',
        projectRoot: 'TEST-PROJECT-ROOT-ONE-LEVEL',
      };
      const root = optionsWithOneLevel.projectRoot;
      await nestGenerator(tree, optionsWithOneLevel);
      expect(tree.read(`${root}/eslint.config.mjs`)?.toString()).toContain(
        "import baseConfig from '../eslint.config.mjs';"
      );
      expect(tree.read(`${root}/project.json`)?.toString()).toContain(
        '"$schema": "../node_modules/nx/schemas/project-schema.json"'
      );
      expect(tree.read(`${root}/tsconfig.json`)?.toString()).toContain(
        '"extends": "../tsconfig.base.json"'
      );
    });

    it('should handle three level deep projects', async () => {
      const optionsWithThreeLevels = {
        name: 'my-test-project',
        projectRoot: 'one/two/TEST-PROJECT-ROOT-THREE-LEVEL',
      };
      const root = optionsWithThreeLevels.projectRoot;
      await nestGenerator(tree, optionsWithThreeLevels);
      expect(tree.read(`${root}/eslint.config.mjs`)?.toString()).toContain(
        "import baseConfig from '../../../eslint.config.mjs';"
      );
      expect(tree.read(`${root}/project.json`)?.toString()).toContain(
        '"$schema": "../../../node_modules/nx/schemas/project-schema.json"'
      );
      expect(tree.read(`${root}/tsconfig.json`)?.toString()).toContain(
        '"extends": "../../../tsconfig.base.json"'
      );
    });
  });
});
