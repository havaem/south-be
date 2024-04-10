import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

import { getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Role } from "./role.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Permission extends BaseSchema {
    @ApiProperty({
        example: "LOGIN",
        required: true,
        description: "Permission name.",
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
        example: "This permission allows the user to login.",
        description: "Permission description.",
        required: false,
    })
    @Prop({
        type: String,
    })
    description: string;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.methods["toDto"] = toDto;

const PermissionSchemaModule = MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]);

export { PermissionSchema, PermissionSchemaModule };
