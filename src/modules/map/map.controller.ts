import { Body, Controller, Param, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { Api, MongoId } from "@/decorators";

import { CreateMapDto } from "./dto/create-map.dto";
import { UpdateMapDto } from "./dto/update-map.dto";
import { MAP_MESSAGES } from "./map.message";
import { MapService } from "./map.service";

@ApiTags("map")
@Controller("map")
export class MapController {
    constructor(private readonly mapService: MapService) {}
    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() body: CreateMapDto) {
        return this.mapService.create(body);
    }

    @Api({
        publicRoute: true,
        responseMessage: MAP_MESSAGES.FIND_ALL,
    })
    @ApiQuery({
        name: "name",
        required: false,
        description: "Name of the map",
    })
    findAll(@Query("name") name: string) {
        return this.mapService.find({
            name: { $regex: name ?? "", $options: "i" },
        });
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: MAP_MESSAGES.FIND,
    })
    find(@Param("id", MongoId) id: string) {
        return this.mapService._findById(id);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: MAP_MESSAGES.FIND,
        method: "PATCH",
    })
    update(@Param("id", MongoId) id: string, @Body() body: UpdateMapDto) {
        return this.mapService._updateById(id, body);
    }

    @Api({
        path: ":id",
        publicRoute: true,
        responseMessage: MAP_MESSAGES.DELETE,
        method: "DELETE",
    })
    remove(@Param("id", MongoId) id: string) {
        return this.mapService.remove(id);
    }
}
