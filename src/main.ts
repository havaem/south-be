import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as compression from "compression";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import * as winston from "winston";

import { AppModule } from "./app.module";
import { GlobalModule } from "./shared/modules/global.module";
import { ConfigService } from "./shared/services/config.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: "*",
        },
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike("South", {
                            colors: true,
                            prettyPrint: true,
                        }),
                    ),
                }),
            ],
        }),
    });
    //* using configService to get environment variables
    const configService = app.select(GlobalModule).get(ConfigService);

    //* global prefix set
    app.setGlobalPrefix(configService.appConfig.prefix);

    //* compress response
    app.use(compression());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );

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
