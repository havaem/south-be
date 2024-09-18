import { PickType } from "@nestjs/swagger";

import { GameProfile } from "@/schemas";

export class CreateGameProfileDto extends PickType(GameProfile, ["hero"]) {}
