import { forwardRef, Module } from "@nestjs/common";

import { GameProfileSchemaModule } from "@/schemas";

import { GameObjectModule } from "../game-object/game-object.module";
import { GameProfileController } from "./game-profile.controller";
import { GameProfileService } from "./game-profile.service";

@Module({
    imports: [GameProfileSchemaModule, forwardRef(() => GameObjectModule)],
    controllers: [GameProfileController],
    providers: [GameProfileService],
    exports: [GameProfileService],
})
export class GameProfileModule {}
