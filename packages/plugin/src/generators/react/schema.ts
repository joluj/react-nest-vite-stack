import z from 'zod';

export const NestGeneratorConfigSchema = z
  .object({
    name: z.string(),
    projectRoot: z.string().optional(),
    importName: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    projectRoot: data.projectRoot || `apps/${data.name}`,
    importName: data.importName || `${data.name}`,
  }));

export type NestGeneratorConfig = z.infer<typeof NestGeneratorConfigSchema>;
export type NestGeneratorConfigInput = z.input<
  typeof NestGeneratorConfigSchema
>;
