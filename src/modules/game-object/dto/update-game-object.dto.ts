import { PickType } from "@nestjs/swagger";

import { CreateGameObjectDto } from "./create-game-object.dto";

export class UpdateGameObjectDto extends PickType(CreateGameObjectDto, ["data"]) {}
