import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { reactGenerator } from '../react/main';
import { rtkqGenerator } from './main';
import { RtkqStoreGeneratorConfigInput } from './schema';
import { describe, it, beforeEach, expect } from 'vitest';
import { ReactGeneratorConfigInput } from '../react/schema';
import { NestGeneratorConfigInput } from '../nest/schema';
import { nestGenerator } from '../nest/main';

describe('nest generator', () => {
  let tree: Tree;
  const rtkqOptions: RtkqStoreGeneratorConfigInput = {
    pathToFrontend: 'apps/frontend',
    openApiSpec: 'apps/backend/openapi.spec.json',
  };
  const reactOptions: ReactGeneratorConfigInput = {
    name: 'my-react-app',
    projectRoot: rtkqOptions.pathToFrontend,
  };
  const nestOptions: NestGeneratorConfigInput = {
    name: 'my-nest-app',
    projectRoot: 'apps/backend',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should not throw errors', async () => {
    await nestGenerator(tree, nestOptions);
    await reactGenerator(tree, reactOptions);
    await rtkqGenerator(tree, rtkqOptions);
    const config = readProjectConfiguration(tree, reactOptions.name);

    expect(config).toBeDefined();
  });
});
