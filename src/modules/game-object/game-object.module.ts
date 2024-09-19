import { forwardRef, Module } from "@nestjs/common";

import { GameObjectSchemaModule } from "@/schemas/game-object.schema";

import { GameProfileModule } from "../game-profile/game-profile.module";
import { SpriteModule } from "../sprite/sprite.module";
import { GameObjectService } from "./game-object.service";
import { GameObjectController } from "./game-object.controller";

@Module({
    imports: [GameObjectSchemaModule, forwardRef(() => GameProfileModule), SpriteModule],
    controllers: [GameObjectController],
    providers: [GameObjectService],
    exports: [GameObjectService],
})
export class GameObjectModule {}
