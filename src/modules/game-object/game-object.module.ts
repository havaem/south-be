import { forwardRef, Module } from "@nestjs/common";

import { GameObjectSchemaModule } from "@/schemas/game-object.schema";

import { GameProfileModule } from "../game-profile/game-profile.module";
import { GameObjectController } from "./game-object.controller";
import { GameObjectService } from "./game-object.service";

@Module({
    imports: [GameObjectSchemaModule, forwardRef(() => GameProfileModule)],
    controllers: [GameObjectController],
    providers: [GameObjectService],
    exports: [GameObjectService],
})
export class GameObjectModule {}
