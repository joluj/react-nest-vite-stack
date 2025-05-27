import z from 'zod';

export const ReactGeneratorConfigSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    projectRoot: z.string().optional(),
    importName: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    projectRoot: data.projectRoot || `apps/${data.name}`,
    importName: data.importName || `${data.name}`,
  }));

export type ReactGeneratorConfig = z.infer<typeof ReactGeneratorConfigSchema>;
export type ReactGeneratorConfigInput = z.input<
  typeof ReactGeneratorConfigSchema
>;
