import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId } from "@/decorators";

import { SPRITE_MESSAGES } from "./animation.message";
import { UpdateSpriteDto } from "./dto/update-sprite.dto";
import { SpriteService } from "./sprite.service";

@ApiTags("sprite")
@Controller("sprite")
export class SpriteController {
    constructor(private readonly spriteService: SpriteService) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create() {
        // const all = this.spriteService.find();
        // all.updateMany(
        //     {},
        //     {
        //         animations: [
        //             new ObjectId("66d8343916e629667fc5f8a4"),
        //             new ObjectId("66d8343916e629667fc5f8a1"),
        //             new ObjectId("66d8343916e629667fc5f8a3"),
        //             new ObjectId("66d8343916e629667fc5f8a2"),
        //             new ObjectId("66d8343916e629667fc5f8a8"),
        //             new ObjectId("66d8343916e629667fc5f8a6"),
        //             new ObjectId("66d8343916e629667fc5f8a7"),
        //             new ObjectId("66d8343916e629667fc5f8a5"),
        //         ],
        //     },
        // );
        // return all;
    }

    @Api({
        publicRoute: true,
        responseMessage: SPRITE_MESSAGES.FIND_ALL,
    })
    findAll() {
        return this.spriteService.find();
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: SPRITE_MESSAGES.FIND,
    })
    findOne(@Param("id", MongoId) id: string) {
        return this.spriteService._findById(id);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: SPRITE_MESSAGES.FIND,
        method: "PATCH",
    })
    update(@Param("id", MongoId) id: string, @Body() body: UpdateSpriteDto) {
        return this.spriteService._updateById(id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: SPRITE_MESSAGES.DELETE,
        method: "DELETE",
    })
    remove(@Param("id", MongoId) id: string) {
        return this.spriteService.remove(id);
    }
}
