import { PartialType } from "@nestjs/swagger";

import { CreateGameObjectDto } from "./create-game-object.dto";

export class UpdateGameObjectDto extends PartialType(CreateGameObjectDto) {}
