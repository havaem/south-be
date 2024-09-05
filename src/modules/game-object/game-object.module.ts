import { Module } from "@nestjs/common";

import { GameObjectSchemaModule } from "@/schemas/game-object.schema";

import { GameObjectController } from "./game-object.controller";
import { GameObjectService } from "./game-object.service";

@Module({
    imports: [GameObjectSchemaModule],
    controllers: [GameObjectController],
    providers: [GameObjectService],
    exports: [GameObjectService],
})
export class GameObjectModule {}
