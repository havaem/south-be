import { PickType } from "@nestjs/swagger";

import { Role } from "@/schemas/role.schema";

export class CreateRoleDto extends PickType(Role, ["name", "description"]) {}
