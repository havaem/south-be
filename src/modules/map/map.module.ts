import { Module } from "@nestjs/common";

import { MapSchemaModule } from "@/schemas/map.schema";

import { MapController } from "./map.controller";
import { MapService } from "./map.service";

@Module({
    imports: [MapSchemaModule],
    controllers: [MapController],
    providers: [MapService],
})
export class MapModule {}
