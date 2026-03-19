const DEFAULT_DB_PORT = 5436;
const DEFAULT_DB_SCHEMA = "public";

export interface DatabaseConfig {
  connectionName: string;
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
}

function toBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function createDatabaseUrl(config: {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
}): string {
  const credentials = `${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}`;
  return `postgresql://${credentials}@${config.host}:${config.port}/${config.database}?schema=${config.schema}`;
}

export function getDatabaseConfig(
  env: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const host = env.DB_HOST ?? "localhost";
  const port = Number(env.DB_PORT ?? DEFAULT_DB_PORT);
  const username = env.DB_USER ?? "postgres";
  const password = env.DB_PASSWORD ?? "postgres";
  const database = env.DB_NAME ?? "Dimel's course";
  const schema = env.DB_SCHEMA ?? DEFAULT_DB_SCHEMA;
  const ssl = toBoolean(env.DB_SSL, false);
  const synchronize = toBoolean(env.DB_SYNCHRONIZE, false);
  const logging = toBoolean(env.DB_LOGGING, false);
  const url =
    env.DATABASE_URL ??
    createDatabaseUrl({
      host,
      port,
      username,
      password,
      database,
      schema,
    });

  return {
    connectionName: "primary-postgres",
    url,
    host,
    port,
    username,
    password,
    database,
    schema,
    ssl,
    synchronize,
    logging,
  };
}
