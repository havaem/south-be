import { Module } from "@nestjs/common";

import { PermissionSchemaModule } from "@/schemas";

import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

@Module({
    imports: [PermissionSchemaModule],
    controllers: [PermissionController],
    providers: [PermissionService],
})
export class PermissionModule {}
