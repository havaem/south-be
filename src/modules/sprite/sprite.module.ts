import { Module } from "@nestjs/common";

import { SpriteSchemaModule } from "@/schemas/sprite.schema";

import { ResourceModule } from "../resource/resource.module";
import { SpriteController } from "./sprite.controller";
import { SpriteService } from "./sprite.service";

@Module({
    imports: [SpriteSchemaModule, ResourceModule],
    controllers: [SpriteController],
    providers: [SpriteService],
    exports: [SpriteService],
})
export class SpriteModule {}
