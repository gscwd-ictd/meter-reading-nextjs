import { z, ZodError } from "zod";

const EnvSchema = z.object({
  // Add environment variables here...
  APP_HOST: z.string().url(),
  NEXT_PUBLIC_HOST: z.string().url(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  HRMS_DB_HOST: z.string(),
  HRMS_DB_PORT: z.coerce.number(),
  HRMS_DB_USER: z.string(),
  HRMS_DB_PASS: z.string(),
  HRMS_DB_NAME: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (error) {
  const zodError = error as ZodError;

  console.error(zodError.flatten().fieldErrors);

  process.exit(1);
}

export default env;
