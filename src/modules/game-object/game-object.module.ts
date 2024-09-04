import { Module } from "@nestjs/common";

import { GameObjectController } from "./game-object.controller";
import { GameObjectService } from "./game-object.service";

@Module({
    controllers: [GameObjectController],
    providers: [GameObjectService],
})
export class GameObjectModule {}
