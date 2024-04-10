import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import * as morgan from "morgan";

import { AppModule } from "./app.module";
import { swaggerConfig } from "./configs/swagger.config";
import { GlobalModule } from "./shared/modules/global.module";
import { ConfigService } from "./shared/services/config.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: "*",
        },
        logger: ["error"],
    });
    //* using configService to get environment variables
    const configService = app.select(GlobalModule).get(ConfigService);

    //* global prefix set
    app.setGlobalPrefix(configService.appConfig.prefix);

    //* compress response
    app.use(compression());

    //* log request
    app.use(morgan("dev"));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            enableDebugMessages: true,
        }),
    );

    if (configService.appConfig.documentEnabled) swaggerConfig(app, configService.appConfig.swaggerPath);

    await app.listen(configService.appConfig.port, () => {
        console.log(
            `🚀[SERVER] Documentation http://localhost:${configService.appConfig.port}${configService.appConfig.swaggerPath}`,
        );
        console.log(
            `🚀[SERVER] Running on http://localhost:${configService.appConfig.port}${configService.appConfig.prefix}`,
        );
    });
}
bootstrap();
