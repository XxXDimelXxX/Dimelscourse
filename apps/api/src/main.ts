import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { getAppConfig, loadEnvironment } from "./core/config/index";

async function bootstrap(): Promise<void> {
  loadEnvironment();

  const app = await NestFactory.create(AppModule);
  const appConfig = getAppConfig();
  app.enableCors({
    origin: appConfig.corsOrigin,
  });

  await app.listen(appConfig.port, appConfig.host);
}

void bootstrap();
