import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
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
            useFactory: async (cfg: ConfigService) => ({
                uri: cfg.mongoUri,
            }),
            inject: [ConfigService],
        }),
        GlobalModule,
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
