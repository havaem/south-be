import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId, User } from "@/decorators";
import { IUserRequest } from "@/shared/types";

import { UpdateGameObjectDto } from "../game-object/dto/update-game-object.dto";
import { GAME_OBJECT_MESSAGES } from "../game-object/game-object.message";
import { CreateGameProfileDto } from "./dto/create-game-profile.dto";
import { GameProfileService } from "./game-profile.service";

@ApiTags("game-profile")
@Controller("game-profile")
export class GameProfileController {
    constructor(private readonly gameProfileService: GameProfileService) {}
    @Api({
        path: "current",
        method: "GET",
        responseMessage: GAME_OBJECT_MESSAGES.GET_CURRENT_USER_GAME_PROFILE,
    })
    async getCurrentUserGameProfile(@User() user: IUserRequest) {
        const current = await this.gameProfileService.findOne({
            user: user._id,
        });
        if (!current) {
            const newDoc = await this.gameProfileService.create({
                user: user._id,
                hero: "66da6e8ded32beba88b44ade",
            });

            return newDoc;
        }
        return current;
    }

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() body: CreateGameProfileDto) {
        return this.gameProfileService.create(body);
    }

    @Api({
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND_ALL,
    })
    findAll() {
        return this.gameProfileService.find();
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND,
    })
    findOne(@Param("id", MongoId) id: string) {
        return this.gameProfileService._findById(id);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND,
        method: "PATCH",
    })
    update(@Param("id", MongoId) id: string, @Body() body: UpdateGameObjectDto) {
        return this.gameProfileService._updateById(id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.DELETE,
        method: "DELETE",
    })
    remove(@Param("id", MongoId) id: string) {
        return this.gameProfileService.remove(id);
    }
}
