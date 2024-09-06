import { PartialType, PickType } from "@nestjs/swagger";

import { GameObject } from "@/schemas/game-object.schema";

export class CreateGameObjectDto extends PartialType(
    PickType(GameObject, ["name", "type", "index", "position", "data"]),
) {}
