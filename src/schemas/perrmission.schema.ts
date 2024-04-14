import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsObject, IsString } from "class-validator";
import { HydratedDocument } from "mongoose";

import { EAction } from "@/constants/aciton";
import { getInvalidMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";

export type PermissionDocument = HydratedDocument<Permission>;

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
    @IsString({
        message: getRequiredMessage("name"),
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
    @IsString()
    @Prop({
        type: String,
    })
    description: string;

    @ApiProperty({
        example: "CREATE",
        required: true,
        description: "Action.",
        enum: EAction,
    })
    @IsEnum(EAction, { message: getInvalidMessage("action") })
    @Prop({
        type: String,
        enum: EAction,
        required: true,
    })
    action: `${EAction}`;

    @ApiProperty({
        example: "User",
        required: true,
        description: "Subject.",
    })
    @IsString({
        message: getRequiredMessage("subject"),
    })
    @Prop({
        type: String,
        required: true,
    })
    subject: string;

    @ApiProperty({
        example: ["password"],
        required: false,
        description: "Fields.",
    })
    @IsString({
        each: true,
    })
    @Prop({
        type: [String],
        default: [],
    })
    fields: string[];

    @ApiProperty({
        example: { _id: "123456" },
        required: false,
        description: "Conditions.",
    })
    @IsObject()
    @Prop({
        type: Object,
        default: null,
    })
    conditions: Record<string, unknown> | null;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.methods["toDto"] = toDto;

const PermissionSchemaModule = MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]);

export { PermissionSchema, PermissionSchemaModule };
