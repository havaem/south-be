import { Body, Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";

import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleService } from "./role.service";

@ApiTags("role")
@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Api({
        publicRoute: true,
        method: "POST",
        path: "/",
        responseMessage: "Role created successfully",
        responseStatus: 201,
    })
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    // @Get()
    // findAll() {
    //     return this.roleService.findAll();
    // }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.roleService.findOne(id);
    // }

    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    //     return this.roleService.update(+id, updateRoleDto);
    // }

    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.roleService.remove(+id);
    // }
}
