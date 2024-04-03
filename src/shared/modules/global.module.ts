import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ConfigService } from "../services/config.service";

const imports = [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: ".env",
    }),
];
const providers = [ConfigService];

@Global()
@Module({
    imports,
    providers,
    exports: [...providers],
})
export class GlobalModule {}
