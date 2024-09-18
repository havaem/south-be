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
        const response = await this.gameProfileService.getCurrentUserGameProfile(user._id);
        return response;
    }

    // @Api({
    //     path: "current",
    //     method: "PATCH",
    //     responseMessage: GAME_OBJECT_MESSAGES.UPDATE_CURRENT_USER_GAME_PROFILE,
    // })
    // async updateCurrentUserGameProfile(@User() user: IUserRequest, @Body() body: UpdateGameObjectDto) {
    //     const response = await this.gameProfileService.updateCurrentUserGameProfile(user._id, body);
    //     return response.toDto(GameProfile);
    // }

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
