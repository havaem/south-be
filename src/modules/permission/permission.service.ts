import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Permission, PermissionDocument } from "@/schemas";

import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

@Injectable()
export class PermissionService {
    constructor(@InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>) {}
    create(createPermissionDto: CreatePermissionDto) {
        return this.permissionModel.create(createPermissionDto);
    }

    findAll() {
        return `This action returns all permission`;
    }

    findOne(id: number) {
        return `This action returns a #${id} permission`;
    }

    update(id: number, updatePermissionDto: UpdatePermissionDto) {
        return `This action updates a #${id} permission`;
    }

    remove(id: number) {
        return `This action removes a #${id} permission`;
    }
}
