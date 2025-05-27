import z from 'zod';

export const RtkqStoreGeneratorConfigSchema = z.object({
  pathToFrontend: z.string().min(1, 'Name is required'),
  openApiSpec: z.string().min(1, 'OpenAPI path is required'),
});

export type RtkqStoreGeneratorConfig = z.infer<
  typeof RtkqStoreGeneratorConfigSchema
>;
export type RtkqStoreGeneratorConfigInput = z.input<
  typeof RtkqStoreGeneratorConfigSchema
>;
