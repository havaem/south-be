import { accessibleRecordsPlugin } from "@casl/mongoose";
import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { NestjsFormDataModule } from "nestjs-form-data";

import { AllExceptionFilter } from "./exceptions/all.exception";
import { CaslExceptionFilter } from "./exceptions/casl.exception";
import { HttpExceptionFilter } from "./exceptions/http.exception";
import { MongoExceptionFilter } from "./exceptions/mongo.exception";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { AuthModule } from "./modules/auth/auth.module";
import { CloudflareModule } from "./modules/cloudflare/cloudflare.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { PostModule } from "./modules/post/post.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { RoleModule } from "./modules/role/role.module";
import { UserModule } from "./modules/user/user.module";
import { AuthGuard } from "./shared/guards/auth.guard";
import { PermissionsGuard } from "./shared/guards/permission.guard";
import { GlobalModule } from "./shared/modules/global.module";
import { ConfigService } from "./shared/services/config.service";
import { SpriteModule } from './modules/sprite/sprite.module';
import { ResourceModule } from './modules/resource/resource.module';
import { AnimationModule } from './modules/animation/animation.module';
import { GameObjectModule } from './modules/game-object/game-object.module';
import { MapModule } from './modules/map/map.module';
import { GameProfileModule } from './modules/game-profile/game-profile.module';
import { GameEventModule } from './modules/game-event/game-event.module';

@Module({
    imports: [
        NestjsFormDataModule.config({ isGlobal: true }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        MongooseModule.forRootAsync({
            imports: [GlobalModule],
            useFactory: async (cfg: ConfigService) => {
                mongoose.plugin(accessibleRecordsPlugin);
                mongoose.plugin(require("mongoose-autopopulate"));

                return {
                    uri: cfg.mongoUri,
                };
            },
            inject: [ConfigService],
        }),
        GlobalModule,
        PostModule,
        CloudflareModule,
        UserModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        ProfileModule,
        SpriteModule,
        ResourceModule,
        AnimationModule,
        GameObjectModule,
        MapModule,
        GameProfileModule,
        GameEventModule,
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
            useClass: AllExceptionFilter,
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
