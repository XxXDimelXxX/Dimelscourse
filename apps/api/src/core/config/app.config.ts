const DEFAULT_PORT = 3000;

export interface AppConfig {
  nodeEnv: string;
  host: string;
  port: number;
  corsOrigin: string;
}

export function getAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    nodeEnv: env.NODE_ENV ?? "development",
    host: env.HOST ?? "127.0.0.1",
    port: Number(env.PORT ?? DEFAULT_PORT),
    corsOrigin: env.CORS_ORIGIN ?? "http://localhost:5173",
  };
}
