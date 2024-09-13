import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ObjectId } from "mongodb";

import { Api, MongoId } from "@/decorators";

import { ResourceService } from "../resource/resource.service";
import { UpdateSpriteDto } from "./dto/update-sprite.dto";
import { SPRITE_MESSAGES } from "./sprite.message";
import { SpriteService } from "./sprite.service";

@ApiTags("sprite")
@Controller("sprite")
export class SpriteController {
    constructor(
        private readonly spriteService: SpriteService,
        private readonly resourceService: ResourceService,
    ) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    async create() {
        const handleUrl = (url: string) => {
            const split = url.split("/");
            const last = split[split.length - 1];
            const name = last.split(".")[0];
            return name;
        };

        const resources = (await this.resourceService.findBy("CHARACTER_HAIR")).sort((a, b) => {
            return a.src.localeCompare(b.src);
        });

        const newSprites = resources.map((resource) => {
            const name = handleUrl(resource.src);
            return {
                name,
                resource: resource._id,
                animations: [
                    new ObjectId("66d8343916e629667fc5f8a4"),
                    new ObjectId("66d8343916e629667fc5f8a1"),
                    new ObjectId("66d8343916e629667fc5f8a3"),
                    new ObjectId("66d8343916e629667fc5f8a2"),
                    new ObjectId("66d8343916e629667fc5f8a8"),
                    new ObjectId("66d8343916e629667fc5f8a6"),
                    new ObjectId("66d8343916e629667fc5f8a7"),
                    new ObjectId("66d8343916e629667fc5f8a5"),
                ],
                verticalFrame: 20,
                horizontalFrame: 28,
                defaultFrame: 1,
                scale: 1,
                position: {
                    x: 0,
                    y: -20,
                },
                offset: {
                    x: 0,
                    y: 0,
                },
                frameSize: {
                    x: 16,
                    y: 32,
                },
            };
        });

        await this.spriteService.createMany(newSprites as any);
        return newSprites;
        // const hairs: CreateSpriteDto[] = [{}];
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
        path: "character-builder",
        method: "GET",
        publicRoute: true,
    })
    getResourceCharacterBuilder() {
        return [];
        // return this.spriteService.getResourceCharacterBuilder();
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
