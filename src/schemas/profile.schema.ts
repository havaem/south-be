import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsNotEmptyObject,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
    ValidateNested,
} from "class-validator";
import mongoose, { HydratedDocument } from "mongoose";

import { getInvalidMessage, getMaxLengthMessage, getMinLengthMessage, getRequiredMessage } from "@/shared/utils";
import { toDto } from "@/shared/utils/toDto";

import { BaseSchema } from "./base.schema";
import { User, UserPopulate } from "./user.schema";

export type ProfileDocument = HydratedDocument<Profile>;

export class ProfileName {
    @ApiProperty({
        required: true,
        description: "First name of the user",
    })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @MinLength(2, { message: ({ property }) => getMinLengthMessage(property, 2) })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    first: string;

    @ApiProperty({
        required: false,
        description: "Middle name of the user",
    })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    @IsOptional()
    middle: string;

    @ApiProperty({
        required: false,
        description: "Last name of the user",
    })
    @MaxLength(20, { message: ({ property }) => getMaxLengthMessage(property, 20) })
    @IsString({ message: ({ property }) => getInvalidMessage(property) })
    @IsOptional()
    last: string;

    @ApiProperty({
        description: "1: first middle last, -1: last middle first",
    })
    @IsOptional()
    display: number;
}

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Profile extends BaseSchema {
    @ApiProperty({
        type: User,
        required: true,
    })
    @IsString()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
        unique: true,
        autopopulate: UserPopulate(),
    })
    user: User;

    @ApiProperty({
        type: ProfileName,
    })
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => ProfileName)
    @Prop({
        _id: false,
        type: {
            first: {
                type: String,
                required: [true, ({ path }) => getRequiredMessage(path)],
                minlength: [2, getMinLengthMessage("First name", 2)],
                maxlength: [20, getMaxLengthMessage("First name", 20)],
            },
            middle: {
                type: String,
                maxlength: [20, getMaxLengthMessage("Middle name", 20)],
                default: "",
            },
            last: {
                type: String,
                minlength: [2, getMinLengthMessage("Last name", 2)],
                maxlength: [20, getMaxLengthMessage("Last name", 20)],
            },
            display: {
                type: Number,
                required: [true, ({ path }) => getRequiredMessage(path)],
                enum: {
                    values: [1, -1],
                    message: ({ path }) => getInvalidMessage(path),
                },
                default: 1,
            },
        },
    })
    name: {
        first: string;
        middle: string;
        last: string;
        //* 1: first middle last
        //* -1: last middle first
        display: number;
    };

    @ApiProperty({
        example: "https://github.com/havaem.png",
        required: false,
    })
    @IsUrl()
    @Prop({
        type: String,
        default: process.env.DEFAULT_AVATAR ?? "https://github.com/havaem.png",
    })
    avatar: string;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.methods["toDto"] = toDto;

const ProfileSchemaModule = MongooseModule.forFeatureAsync([
    {
        name: Profile.name,
        useFactory: () => {
            const schema = ProfileSchema;

            return schema;
        },
    },
]);

export { ProfileSchema, ProfileSchemaModule };
