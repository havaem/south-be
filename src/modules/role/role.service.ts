import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RoleDocument } from "@/schemas/role.schema";
import { DatabaseService } from "@/shared/services/document.service";

import { CreateRoleDto } from "./dto/create-role.dto";
import { ROLE_MESSAGES } from "./role.message";

@Injectable()
export class RoleService extends DatabaseService<RoleDocument> {
    constructor(@InjectModel("Role") private roleModel: Model<RoleDocument>) {
        super(roleModel, ROLE_MESSAGES);
    }

    create(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
        return this.roleModel.create(createRoleDto);
    }
}
