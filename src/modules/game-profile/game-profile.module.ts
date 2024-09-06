import { Module } from "@nestjs/common";

import { GameProfileSchemaModule } from "@/schemas/game-profile";

import { GameProfileController } from "./game-profile.controller";
import { GameProfileService } from "./game-profile.service";

@Module({
    imports: [GameProfileSchemaModule],
    controllers: [GameProfileController],
    providers: [GameProfileService],
})
export class GameProfileModule {}
