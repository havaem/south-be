import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Api } from "@/decorators";

import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { PermissionService } from "./permission.service";

@ApiTags("permission")
@Controller("permission")
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Api({
        publicRoute: true,
        path: "/",
        method: "POST",
        responseStatus: 201,
        responseMessage: "This action adds a new permission",
    })
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.permissionService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionService.update(+id, updatePermissionDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.permissionService.remove(+id);
    }
}
