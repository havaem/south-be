import { Module } from "@nestjs/common";

import { CaslAbilityFactory } from "../services/casl.service";

@Module({
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
