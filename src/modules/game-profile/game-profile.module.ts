import { Module } from "@nestjs/common";

import { GameProfileSchemaModule } from "@/schemas/game-profile";

import { GameObjectController } from "../game-object/game-object.controller";
import { GameProfileController } from "./game-profile.controller";
import { GameProfileService } from "./game-profile.service";

@Module({
    imports: [GameProfileSchemaModule, GameObjectController],
    controllers: [GameProfileController],
    providers: [GameProfileService],
})
export class GameProfileModule {}
