import { DataSource } from "typeorm";
import { getDatabaseConfig, loadEnvironment } from "../config";
import { TYPEORM_ENTITIES } from "./typeorm-entities";

loadEnvironment();

const config = getDatabaseConfig();

export const seedDataSource = new DataSource({
  type: "postgres",
  url: config.url,
  schema: config.schema,
  ssl: config.ssl ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: config.logging,
  entities: TYPEORM_ENTITIES,
});
