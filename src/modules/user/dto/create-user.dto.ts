import { OmitType, PartialType } from "@nestjs/swagger";

import { User } from "@/schemas/user.schema";

export class CreateUserDto extends PartialType(
    OmitType(User, ["_id", "createdAt", "deletedAt", "updatedAt", "comparePassword", "hero"]),
) {}
