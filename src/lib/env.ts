import z4, { ZodError } from "zod/v4";

const EnvSchema = z4.object({
  // Add environment variables here...
  NEXT_PUBLIC_HOST: z4.url(),
  APP_HOST: z4.url(),

  POSTGRES_HOST: z4.string(),
  POSTGRES_PORT: z4.coerce.number(),
  POSTGRES_USER: z4.string(),
  POSTGRES_PASS: z4.string(),
  POSTGRES_NAME: z4.string(),

  MSSQL_HOST: z4.string(),
  MSSQL_PORT: z4.coerce.number(),
  MSSQL_USER: z4.string(),
  MSSQL_PASS: z4.string(),
  MSSQL_NAME: z4.string(),

  PRIVATE_KEY_B64: z4.string().optional(),
  PUBLIC_KEY_B64: z4.string().optional(),
});

export type Env = z4.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as ZodError;

  console.error(z4.treeifyError(zodError));

  process.exit(1);
}

export default env;
