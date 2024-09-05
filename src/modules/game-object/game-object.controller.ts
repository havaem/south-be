import { Body, Controller, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api, MongoId } from "@/decorators";

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
    findAll() {
        return this.gameObjectService.find();
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND,
    })
    findOne(@Param("id", MongoId) id: string) {
        return this.gameObjectService._findById(id);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: GAME_OBJECT_MESSAGES.FIND,
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
