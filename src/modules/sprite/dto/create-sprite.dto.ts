import { OmitType } from "@nestjs/swagger";

import { Sprite } from "@/schemas/sprite.schema";

export class CreateSpriteDto extends OmitType(Sprite, ["_id"]) {}
