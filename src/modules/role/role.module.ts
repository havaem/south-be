import { Module } from "@nestjs/common";

import { RoleSchemaModule } from "@/schemas/role.schema";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
    imports: [RoleSchemaModule],
    controllers: [RoleController],
    providers: [RoleService],
})
export class RoleModule {}
