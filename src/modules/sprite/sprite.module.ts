import { Module } from "@nestjs/common";

import { SpriteSchemaModule } from "@/schemas/sprite.schema";

import { SpriteController } from "./sprite.controller";
import { SpriteService } from "./sprite.service";

@Module({
    imports: [SpriteSchemaModule],
    controllers: [SpriteController],
    providers: [SpriteService],
})
export class SpriteModule {}
