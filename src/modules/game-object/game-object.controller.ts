import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId, User } from "@/decorators";
import { GameObject } from "@/schemas";
import { IUserRequest } from "@/shared/types";

import { CreateGameObjectDto } from "./dto/create-game-object.dto";
import { UpdateGameObjectDto } from "./dto/update-game-object.dto";
import { GAME_OBJECT_MESSAGES } from "./game-object.message";
import { GameObjectService } from "./game-object.service";

@ApiTags("game-object")
@Controller("game-object")
export class GameObjectController {
    constructor(private readonly gameObjectService: GameObjectService) {}
    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() body: CreateGameObjectDto) {
        return this.gameObjectService.create(body);
    }

    @Api({
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND_ALL,
    })
    async findAll() {
        const response = await this.gameObjectService.find();
        return response.map((item) => item.toDto(GameObject));
    }

    @Api({
        path: "current",
        responseMessage: GAME_OBJECT_MESSAGES.UPDATE,
        method: "PATCH",
    })
    updateCurrent(@User() user: IUserRequest, @Body() body: UpdateGameObjectDto) {
        return this.gameObjectService.updateCurrent(user._id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND,
    })
    async findById(@Param("id", MongoId) id: string) {
        const response = await this.gameObjectService.findByIdAndPopulate(id);
        return response.toDto(GameObject);
    }

    @Api({
        path: ":id",
        responseMessage: GAME_OBJECT_MESSAGES.UPDATE,
        method: "PATCH",
    })
    update(@Param("id", MongoId) id: string, @Body() body: UpdateGameObjectDto) {
        return this.gameObjectService._updateById(id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.DELETE,
        method: "DELETE",
    })
    remove(@Param("id", MongoId) id: string) {
        return this.gameObjectService.remove(id);
    }
}
