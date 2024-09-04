import { PickType } from "@nestjs/swagger";

import { Resource } from "@/schemas/resource.schema";

export class CreateResourceDto extends PickType(Resource, ["type", "src"]) {}
