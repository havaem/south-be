import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { Permission } from "./perrmission.schema";

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
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
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
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
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
}

const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.methods["toDto"] = toDto;

const RoleSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Role.name,
        useFactory: () => {
            const schema = RoleSchema;
            return schema;
        },
    },
]);

export { RoleSchema, RoleSchemaModule };
