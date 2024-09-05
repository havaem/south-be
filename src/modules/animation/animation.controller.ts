import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId } from "@/decorators";

import { ANIMATION_MESSAGES } from "./animation.message";
import { AnimationService } from "./animation.service";
import { CreateAnimationDto } from "./dto/create-animation.dto";
import { UpdateAnimationDto } from "./dto/update-animation.dto";

@ApiTags("animation")
@Controller("animation")
export class AnimationController {
    constructor(private readonly animationService: AnimationService) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() body: CreateAnimationDto) {
        return this.animationService.create(body);
    }

    @Api({
        publicRoute: true,
        responseMessage: ANIMATION_MESSAGES.FIND_ALL,
    })
    findAll() {
        return this.animationService.find();
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: ANIMATION_MESSAGES.FIND,
    })
    findOne(@Param("id", MongoId) id: string) {
        return this.animationService._findById(id);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: ANIMATION_MESSAGES.FIND,
        method: "PATCH",
    })
    update(@Param("id", MongoId) id: string, @Body() body: UpdateAnimationDto) {
        return this.animationService._updateById(id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: ANIMATION_MESSAGES.DELETE,
        method: "DELETE",
    })
    remove(@Param("id", MongoId) id: string) {
        return this.animationService.remove(id);
    }
}
