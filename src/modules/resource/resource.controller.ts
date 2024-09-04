import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";
import { EResourceType } from "@/schemas/resource.schema";

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
        const data: CreateResourceDto[] = [
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_01.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_02.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_03.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_04.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_05.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_06.png",
                type: EResourceType.CHARACTER_EYES,
            },
            {
                src: "https://cdn.jsdelivr.net/gh/havaem55/pixel-resource@main/moderninteriors-win/2_Characters/Character_Generator/Eyes/16x16/Eyes_07.png",
                type: EResourceType.CHARACTER_EYES,
            },
        ];

        return this.resourceService.createMany(data);
    }

    @Api({
        publicRoute: true,
        method: "GET",
    })
    findAll() {
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
