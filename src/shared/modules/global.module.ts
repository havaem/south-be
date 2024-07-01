import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { CaslAbilityFactory } from "../services/casl.service";
import { ConfigService } from "../services/config.service";
import { DatabaseSession } from "../services/db.service";
import { CaslModule } from "./casl.module";

const imports = [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env",
    }),
    JwtModule.register({}),
    CaslModule,
];
const providers = [ConfigService, JwtService, CaslAbilityFactory, DatabaseSession];

@Global()
@Module({
    imports,
    providers,
    exports: [...providers],
})
export class GlobalModule {}
