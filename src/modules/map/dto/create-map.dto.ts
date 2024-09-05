import { PickType } from "@nestjs/swagger";

import { Map } from "@/schemas/map.schema";

export class CreateMapDto extends PickType(Map, ["grid", "lowerLayer", "upperLayer", "name"]) {}
