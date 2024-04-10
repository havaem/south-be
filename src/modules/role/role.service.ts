import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Role, RoleDocument } from "@/schemas/role.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { CreateRoleDto } from "./dto/create-role.dto";

@Injectable()
export class RoleService extends DatabaseService<RoleDocument> {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
        super(roleModel, {});
    }

    create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
        return this.roleModel.create(createRoleDto);
    }
}
