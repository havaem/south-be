import { PickType } from "@nestjs/swagger";

import { Animation } from "@/schemas";

export class CreateAnimationDto extends PickType(Animation, ["name", "duration", "frames"]) {}
