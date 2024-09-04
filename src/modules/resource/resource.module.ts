import { Module } from "@nestjs/common";

import { ResourceSchemaModule } from "@/schemas/resource.schema";

import { ResourceController } from "./resource.controller";
import { ResourceService } from "./resource.service";

@Module({
    imports: [ResourceSchemaModule],
    controllers: [ResourceController],
    providers: [ResourceService],
})
export class ResourceModule {}
