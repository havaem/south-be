import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";

import { ANIMATION_MESSAGES } from "./animation.message";
import { AnimationService } from "./animation.service";
import { CreateAnimationDto } from "./dto/create-animation.dto";

@ApiTags("animation")
@Controller("animation")
export class AnimationController {
    constructor(private readonly animationService: AnimationService) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() createAnimationDto: CreateAnimationDto) {
        return this.animationService.create(createAnimationDto);
    }

    @Api({
        publicRoute: true,
        responseMessage: ANIMATION_MESSAGES.FIND_ALL,
    })
    findAll() {
        return this.animationService.find();
    }
}
