import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { ConfigService } from "../services/config.service";

const imports = [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env",
    }),
    JwtModule.register({}),
];
const providers = [ConfigService, JwtService];

@Global()
@Module({
    imports,
    providers,
    exports: [...providers],
})
export class GlobalModule {}
