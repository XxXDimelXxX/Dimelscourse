import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { getDatabaseConfig } from "./database.config";
import { TYPEORM_ENTITIES } from "../database/typeorm-entities";

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const config = getDatabaseConfig();

  return {
    type: "postgres",
    url: config.url,
    schema: config.schema,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    synchronize: config.synchronize,
    logging: config.logging,
    entities: TYPEORM_ENTITIES,
    autoLoadEntities: true,
  };
}
