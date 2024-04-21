import { PickType } from "@nestjs/swagger";

import { Permission } from "@/schemas";

export class CreatePermissionDto extends PickType(Permission, ["name", "action", "subject", "fields", "conditions"]) {}
