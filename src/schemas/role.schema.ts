import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { HydratedDocument } from "mongoose";

import { getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Permission } from "./perrmission";
import { User } from "./user.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Role extends BaseSchema {
    @ApiProperty({
        example: "Admin",
        required: true,
        description: "Role name.",
    })
    @Prop({
        type: String,
        trim: true,
        uppercase: true,
        required: [true, getRequiredMessage("name")],
        unique: true,
    })
    name: string;

    @ApiProperty({
        example: "Admin",
        description: "Role description.",
        required: false,
    })
    @Prop({
        type: String,
        default: "",
    })
    description: string;

    @ApiProperty({
        type: [Permission],
        required: false,
        description: "Permissions that the role has.",
    })
    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: Permission.name,
        default: [],
    })
    permissions: Permission[];

    @ApiProperty({
        type: [User],
        required: false,
        description: "Users that have this role.",
    })
    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: User.name,
        default: [],
    })
    users: User[];
}

const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.methods["toDto"] = toDto;

const RoleSchemaModule = MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]);

export { RoleSchema, RoleSchemaModule };
