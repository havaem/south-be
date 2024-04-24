import { accessibleRecordsPlugin } from "@casl/mongoose";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose from "mongoose";

import { CaslExceptionFilter } from "./exceptions/casl.exception";
import { HttpExceptionFilter } from "./exceptions/http.exception";
import { MongoExceptionFilter } from "./exceptions/mongo.exception";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { AuthModule } from "./modules/auth/auth.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { RoleModule } from "./modules/role/role.module";
import { UserModule } from "./modules/user/user.module";
import { AuthGuard } from "./shared/guards/auth.guard";
import { PermissionsGuard } from "./shared/guards/permission.guard";
import { GlobalModule } from "./shared/modules/global.module";
import { ConfigService } from "./shared/services/config.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        MongooseModule.forRootAsync({
            imports: [GlobalModule],
            useFactory: async (cfg: ConfigService) => {
                mongoose.plugin(accessibleRecordsPlugin);
                return {
                    uri: cfg.mongoUri,
                };
            },
            inject: [ConfigService],
        }),
        GlobalModule,
        UserModule,
        AuthModule,
        RoleModule,
        PermissionModule,
    ],
    controllers: [],
    providers: [
        Logger,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
        {
            provide: APP_FILTER,
            useClass: MongoExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: CaslExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {}
