import { PickType } from "@nestjs/swagger";

import { GameProfile } from "@/schemas/game-profile";

export class CreateGameProfileDto extends PickType(GameProfile, ["hero"]) {}
