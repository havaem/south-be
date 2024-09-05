import { PartialType } from "@nestjs/swagger";

import { CreateAnimationDto } from "./create-animation.dto";

export class UpdateAnimationDto extends PartialType(CreateAnimationDto) {}
