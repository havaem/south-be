import { Body, Controller, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";
import { EResourceType } from "@/schemas";

import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceService } from "./resource.service";

@ApiTags("resource")
@Controller("resource")
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) {}

    @Api({
        publicRoute: true,
        method: "POST",
    })
    create(@Body() createResourceDto: CreateResourceDto) {
        const data: CreateResourceDto[] = [];

        return this.resourceService.createMany(data);
        // return this.resourceService.create(createResourceDto);
    }

    @ApiQuery({
        name: "type",
        required: false,
        type: String,
        enum: EResourceType,
    })
    @Api({
        method: "GET",
    })
    findAll(@Query("type") type: string) {
        if (type) {
            return this.resourceService.findBy(type);
        }

        return this.resourceService.findAll();
    }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.resourceService.findOne(+id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateResourceDto: UpdateResourceDto) {
    //     return this.resourceService.update(+id, updateResourceDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.resourceService.remove(+id);
    // }
}
